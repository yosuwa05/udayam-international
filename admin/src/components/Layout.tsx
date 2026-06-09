// // import {
// //   ChevronLeftCircle,
// //   Home,
// //   Library,
// //   User,
// //   Menu,
// //   GraduationCap,
// //   Layers,
// //   Users,
// //   Video,
// //   Bell,
// //   LayoutDashboard,
// //   LogOut,
// //   Landmark,
// // } from 'lucide-react';
// // import { useEffect, useState } from 'react';
// // import { Outlet, useLocation, useNavigate } from '@tanstack/react-router';
// // import { Toaster } from '@/components/ui/sonner';
// // import {
// //   Tooltip,
// //   TooltipContent,
// //   TooltipTrigger,
// // } from '@/components/ui/tooltip';
// // import {
// //   AlertDialog,
// //   AlertDialogAction,
// //   AlertDialogCancel,
// //   AlertDialogContent,
// //   AlertDialogDescription,
// //   AlertDialogFooter,
// //   AlertDialogHeader,
// //   AlertDialogTitle,
// //   AlertDialogTrigger,
// // } from '@/components/ui/alert-dialog';
// // import { useMutation, useQueryClient } from '@tanstack/react-query';
// // import { toast } from 'sonner';
// // import { _axios } from '@/lib/axios';

// // interface Link {
// //   name: string;
// //   href: string;
// //   icon: React.ComponentType<{ className?: string }>;
// // }

// // // All available routes
// // const allLinks: Link[] = [
// //   {
// //     name: 'Dashboard',
// //     href: '/',
// //     icon: Home,
// //   },
// //   {
// //     name: 'Notification',
// //     href: '/notification',
// //     icon: Bell,
// //   },

// // ];

// // interface LayoutProps {
// //   session?: any;
// //   userType?: 'admin' | 'staff' | null;
// // }

// // export default function Layout({ session, userType }: LayoutProps) {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const queryClient = useQueryClient();

// //   const [isIconMode, setIsIconMode] = useState<boolean>(true);
// //   const [activeMenu, setActiveMenu] = useState<string>('');
// //   const [isOpen, setIsOpen] = useState<boolean>(false);
// //   const [isLargeScreen, setIsLargeScreen] = useState<boolean>(true);
// //   const [mounted, setMounted] = useState<boolean>(false);

// //   // Filter links based on user role and allowed routes
// //   const [links, setLinks] = useState<Link[]>(allLinks);

// //   useEffect(() => {
// //     // Filter routes for staff based on allowedRoutes
// //     if (userType === 'staff' && session?.allowedRoutes) {
// //       const allowedRoutes = session.allowedRoutes;
// //       const filteredLinks = allLinks.filter((link) =>
// //         allowedRoutes.includes(link.href),
// //       );
// //       setLinks(filteredLinks);

// //       // If current route is not allowed, redirect to dashboard
// //       if (!allowedRoutes.includes(location.pathname)) {
// //         navigate({ to: '/' });
// //       }
// //     } else {
// //       setLinks(allLinks);
// //     }
// //   }, [userType, session, location.pathname, navigate]);

// //   const logoutMutation = useMutation({
// //     mutationFn: async () => {
// //       // Use appropriate logout endpoint based on user type
// //       const endpoint =
// //         userType === 'admin' ? '/admin-auth/logout' : '/staffs/logout';
// //       const res = await _axios.post(endpoint);
// //       return res.data;
// //     },
// //     onSuccess: () => {
// //       toast.success('Logged out successfully');
// //       queryClient.invalidateQueries({ queryKey: ['session'] });
// //       navigate({ to: '/login' });
// //     },
// //     onError: () => {
// //       toast.error('Logout failed. Please try again.');
// //     },
// //   });

// //   const handleLogOut = () => {
// //     logoutMutation.mutate();
// //   };

// //   useEffect(() => {
// //     setMounted(true);

// //     const savedSidebarMode = localStorage.getItem('sidebarMode');
// //     if (savedSidebarMode === 'icon') {
// //       setIsIconMode(true);
// //     } else {
// //       setIsIconMode(false);
// //     }

// //     setIsLargeScreen(window.innerWidth >= 1024);
// //   }, []);

// //   useEffect(() => {
// //     const handleResize = () => {
// //       setIsLargeScreen(window.innerWidth >= 1024);
// //     };
// //     window.addEventListener('resize', handleResize);
// //     return () => window.removeEventListener('resize', handleResize);
// //   }, []);

// //   useEffect(() => {
// //     if (mounted && isLargeScreen) {
// //       localStorage.setItem('sidebarMode', isIconMode ? 'icon' : 'default');
// //     }
// //   }, [isIconMode, isLargeScreen, mounted]);

// //   const toggleSidebar = () => {
// //     if (isLargeScreen) {
// //       setIsIconMode(!isIconMode);
// //     } else {
// //       setIsOpen(!isOpen);
// //     }
// //   };

// //   const handleMenuClick = (path: string) => {
// //     navigate({ to: path });
// //     setActiveMenu(path);
// //     setIsOpen(false);
// //   };

// //   useEffect(() => {
// //     const activeMenu = location.pathname.split('/')[1]
// //       ? `/${location.pathname.split('/')[1]}`
// //       : '/';
// //     setActiveMenu(activeMenu);
// //   }, [location.pathname]);

// //   // Show user role badge
// //   const getUserRoleDisplay = () => {
// //     if (userType === 'staff') {
// //       return `Staff: ${session?.staffName || 'Staff'}`;
// //     }
// //     return `Admin`;
// //   };

// //   return (
// //     <main>
// //       <aside
// //         className={`z-50
// //           min-h-screen bg-sidebar text-sidebar-foreground transform fixed transition-all duration-300
// //           overflow-hidden
// //           ${
// //             isLargeScreen
// //               ? isIconMode
// //                 ? 'w-20'
// //                 : 'w-72'
// //               : isOpen
// //                 ? 'w-72 opacity-100 pointer-events-auto'
// //                 : 'w-0 p-0 pointer-events-none -translate-x-72 duration-500'
// //           }
// //         `}>
// //         <ul className="flex flex-col gap-0 relative">
// //           <li
// //             className={`flex items-center absolute top-2 right-0 p-2 m-1 gap-3 rounded-sm cursor-pointer ${isIconMode && isLargeScreen ? 'justify-center' : ''}`}>
// //             {!isLargeScreen && (
// //               <ChevronLeftCircle
// //                 className="right-2 cursor-pointer"
// //                 onClick={toggleSidebar}
// //               />
// //             )}
// //             {isLargeScreen && !isIconMode && (
// //               <ChevronLeftCircle
// //                 className="right-2 cursor-pointer"
// //                 onClick={toggleSidebar}
// //               />
// //             )}
// //           </li>

// //           <li
// //             className={`flex items-center p-2 m-1 gap-3 rounded-sm min-h-16 cursor-pointer ${isIconMode && isLargeScreen ? 'justify-center' : ''}`}>
// //             <span>
// //               {!isIconMode && <img src="/logo.png" alt="" className="h-12" />}
// //               {isIconMode && isLargeScreen && (
// //                 <Menu
// //                   className={`cursor-pointer ${isIconMode ? 'top-12 right-0' : ''}`}
// //                   onClick={toggleSidebar}
// //                 />
// //               )}
// //             </span>
// //           </li>

// //           {/* User Role Display */}
// //           {(!isIconMode || !isLargeScreen) && (
// //             <li className="px-4 py-2 mb-4 text-sm text-muted-foreground border-b border-border">
// //               {/* {getUserRoleDisplay()} */}
// //             </li>
// //           )}

// //           {links.map((link, index) =>
// //             isIconMode ? (
// //               <Tooltip key={index}>
// //                 <TooltipTrigger asChild>
// //                   <li
// //                     onClick={() => handleMenuClick(link.href)}
// //                     className={`flex items-center p-2 m-1 gap-3 rounded-sm cursor-pointer hover:bg-background hover:text-sidebar-foreground ${isIconMode && isLargeScreen ? 'justify-center' : ''} ${activeMenu === link.href ? 'bg-black/90 text-white' : ''}`}>
// //                     <span>
// //                       <link.icon className="w-6 h-6" />
// //                     </span>
// //                     {((!isLargeScreen && isOpen) ||
// //                       (isLargeScreen && !isIconMode)) && (
// //                       <span className="text-lg">{link.name}</span>
// //                     )}
// //                   </li>
// //                 </TooltipTrigger>
// //                 <TooltipContent side="right">
// //                   <p>{link.name}</p>
// //                 </TooltipContent>
// //               </Tooltip>
// //             ) : (
// //               <li
// //                 key={index}
// //                 onClick={() => handleMenuClick(link.href)}
// //                 className={`flex items-center p-2 m-1 gap-3 rounded-sm cursor-pointer hover:bg-background hover:text-sidebar-foreground ${isIconMode && isLargeScreen ? 'justify-center' : ''} ${activeMenu === link.href ? 'bg-black/90 text-white' : ''}`}>
// //                 <span>
// //                   <link.icon className="w-6 h-6" />
// //                 </span>
// //                 {((!isLargeScreen && isOpen) ||
// //                   (isLargeScreen && !isIconMode)) && (
// //                   <span className="text-lg">{link.name}</span>
// //                 )}
// //               </li>
// //             ),
// //           )}
// //         </ul>
// //       </aside>

// //       <header
// //         className={`h-16 z-45 fixed flex justify-between transform transition-all duration-300 bg-sidebar text-sidebar-foreground p-2 ${isLargeScreen && !isIconMode ? 'ml-72 min-w-[calc(100vw-18rem)]' : isLargeScreen ? 'ml-20 min-w-[calc(100vw-5rem)]' : 'min-w-full'}`}>
// //         <div className="h-full flex items-center text-primary gap-3">
// //           {!isLargeScreen && (
// //             <Menu className="cursor-pointer" onClick={toggleSidebar} />
// //           )}
// //           <h1 className="text-3xl capitalize text-foreground">
// //             {location.pathname.split('/')[1] !== ''
// //               ? location.pathname.split('/')[1]
// //               : 'Dashboard'}
// //           </h1>
// //           {userType === 'staff' && (
// //             <span className="ml-4 text-sm bg-primary/10 text-primary px-2 py-1 rounded">
// //               Staff Access
// //             </span>
// //           )}
// //         </div>

// //         <div className="h-full flex items-center gap-4 mr-5">
// //           {/* Optional: Show user info */}
// //           {session && (
// //             <div className="hidden md:flex items-center gap-2 text-sm">
// //               <span className="text-muted-foreground">
// //                 {userType === 'staff' ? session.staffName : session.adminName}
// //               </span>
// //             </div>
// //           )}

// //           <AlertDialog>
// //             <AlertDialogTrigger asChild>
// //               <button
// //                 className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
// //                 disabled={logoutMutation.isPending}>
// //                 <LogOut className="w-6 h-6" />
// //                 <span>
// //                   {logoutMutation.isPending ? 'Logging out...' : 'LogOut'}
// //                 </span>
// //               </button>
// //             </AlertDialogTrigger>
// //             <AlertDialogContent>
// //               <AlertDialogHeader>
// //                 <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
// //                 <AlertDialogDescription>
// //                   Are you sure you want to log out? You will need to sign in
// //                   again to access your account.
// //                 </AlertDialogDescription>
// //               </AlertDialogHeader>
// //               <AlertDialogFooter>
// //                 <AlertDialogCancel>Cancel</AlertDialogCancel>
// //                 <AlertDialogAction
// //                   onClick={handleLogOut}
// //                   disabled={logoutMutation.isPending}
// //                   className="cursor-pointer">
// //                   {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
// //                 </AlertDialogAction>
// //               </AlertDialogFooter>
// //             </AlertDialogContent>
// //           </AlertDialog>
// //         </div>
// //       </header>

// //       <main
// //         className={`relative p-2 pt-18 ${isLargeScreen && !isIconMode ? 'ml-72' : isLargeScreen ? 'ml-20' : ''}`}>
// //         <Outlet />
// //         <Toaster position="top-right" />
// //       </main>
// //     </main>
// //   );
// // }
// import {
//   ChevronLeft,
//   Home,
//   Bell,
//   LogOut,
//   Menu,
//   Search,
//   Plus,
//   X,
// } from 'lucide-react'
// import { useEffect, useState } from 'react'
// import { Outlet, useLocation, useNavigate } from '@tanstack/react-router'
// import { Toaster } from '@/components/ui/sonner'
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
//   TooltipProvider,
// } from '@/components/ui/tooltip'
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from '@/components/ui/alert-dialog'
// import { useMutation, useQueryClient } from '@tanstack/react-query'
// import { toast } from 'sonner'
// import { _axios } from '@/lib/axios'

// interface Link {
//   name: string
//   href: string
//   icon: React.ComponentType<{ className?: string; size?: number }>
// }

// const allLinks: Link[] = [
//   { name: 'Dashboard', href: '/', icon: Home },
//   { name: 'Notification', href: '/notification', icon: Bell },
// ]

// interface LayoutProps {
//   session?: any
//   userType?: 'admin' | 'staff' | null
// }

// // ── Brand colours ──────────────────────────────────────────────────
// const SIDEBAR_BG = '#0d2b2e' // deep teal
// const SIDEBAR_TEXT = '#e8f4f0'
// const ACTIVE_BG = 'rgba(255,255,255,0.12)'
// const HOVER_BG = 'rgba(255,255,255,0.07)'
// const GOLD = '#c9a227'
// const HEADER_H = 56
// const SIDEBAR_W = 220
// const SIDEBAR_ICON = 64

// export default function Layout({ session, userType }: LayoutProps) {
//   const navigate = useNavigate()
//   const location = useLocation()
//   const queryClient = useQueryClient()

//   const [collapsed, setCollapsed] = useState(false) // desktop icon-only
//   const [mobileOpen, setMobileOpen] = useState(false) // mobile drawer
//   const [isLarge, setIsLarge] = useState(true)
//   const [activeMenu, setActiveMenu] = useState('/')

//   // Route filtering for staff
//   const [links, setLinks] = useState<Link[]>(allLinks)

//   useEffect(() => {
//     if (userType === 'staff' && session?.allowedRoutes) {
//       setLinks(allLinks.filter((l) => session.allowedRoutes.includes(l.href)))
//       if (!session.allowedRoutes.includes(location.pathname))
//         navigate({ to: '/' })
//     } else {
//       setLinks(allLinks)
//     }
//   }, [userType, session, location.pathname])

//   useEffect(() => {
//     const seg = location.pathname.split('/')[1]
//     setActiveMenu(seg ? `/${seg}` : '/')
//   }, [location.pathname])

//   useEffect(() => {
//     const onResize = () => setIsLarge(window.innerWidth >= 1024)
//     onResize()
//     window.addEventListener('resize', onResize)
//     return () => window.removeEventListener('resize', onResize)
//   }, [])

//   const logoutMutation = useMutation({
//     mutationFn: async () => {
//       const ep = userType === 'admin' ? '/admin-auth/logout' : '/staffs/logout'
//       return (await _axios.post(ep)).data
//     },
//     onSuccess: () => {
//       toast.success('Logged out successfully')
//       queryClient.invalidateQueries({ queryKey: ['session'] })
//       navigate({ to: '/login' })
//     },
//     onError: () => toast.error('Logout failed. Please try again.'),
//   })

//   const handleNav = (path: string) => {
//     navigate({ to: path })
//     setActiveMenu(path)
//     setMobileOpen(false)
//   }

//   const pageTitle = location.pathname.split('/')[1] || 'Dashboard'

//   // computed sidebar width on desktop
//   const desktopW = collapsed ? SIDEBAR_ICON : SIDEBAR_W

//   return (
//     <TooltipProvider>
//       <div
//         style={{
//           fontFamily: "'Inter', 'Segoe UI', sans-serif",
//           minHeight: '100vh',
//           background: '#f4f6f8',
//         }}
//       >
//         {/* ── Mobile overlay ───────────────────────────────────── */}
//         {!isLarge && mobileOpen && (
//           <div
//             onClick={() => setMobileOpen(false)}
//             style={{
//               position: 'fixed',
//               inset: 0,
//               background: 'rgba(0,0,0,0.45)',
//               zIndex: 40,
//               backdropFilter: 'blur(2px)',
//             }}
//           />
//         )}

//         {/* ── Sidebar ──────────────────────────────────────────── */}
//         <aside
//           style={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             bottom: 0,
//             width: isLarge ? desktopW : SIDEBAR_W,
//             background: SIDEBAR_BG,
//             color: SIDEBAR_TEXT,
//             display: 'flex',
//             flexDirection: 'column',
//             zIndex: 50,
//             transition: 'width 280ms ease, transform 280ms ease',
//             transform: isLarge
//               ? 'translateX(0)'
//               : mobileOpen
//                 ? 'translateX(0)'
//                 : `translateX(-${SIDEBAR_W}px)`,
//             overflow: 'hidden',
//           }}
//         >
//           {/* Logo row */}
//           <div
//             style={{
//               height: HEADER_H,
//               display: 'flex',
//               alignItems: 'center',
//               gap: 12,
//               padding: collapsed && isLarge ? '0 16px' : '0 18px',
//               borderBottom: '1px solid rgba(255,255,255,0.08)',
//               flexShrink: 0,
//             }}
//           >
//             {/* Crown icon placeholder */}
//             <div
//               style={{
//                 width: 34,
//                 height: 34,
//                 borderRadius: 8,
//                 background: GOLD,
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 flexShrink: 0,
//                 fontSize: 16,
//                 fontWeight: 700,
//                 color: '#1a1a1a',
//               }}
//             >
//               KP
//             </div>

//             {(!collapsed || !isLarge) && (
//               <div style={{ overflow: 'hidden' }}>
//                 <div
//                   style={{
//                     fontSize: 13,
//                     fontWeight: 700,
//                     color: '#fff',
//                     whiteSpace: 'nowrap',
//                     letterSpacing: '0.02em',
//                   }}
//                 >
//                   ELITE KP JEWELLERY
//                 </div>
//                 <div
//                   style={{ fontSize: 10, color: GOLD, whiteSpace: 'nowrap' }}
//                 >
//                   ஆபரணம் Creators
//                 </div>
//               </div>
//             )}

//             {/* Close on mobile */}
//             {!isLarge && (
//               <button
//                 onClick={() => setMobileOpen(false)}
//                 style={{
//                   marginLeft: 'auto',
//                   background: 'none',
//                   border: 'none',
//                   color: SIDEBAR_TEXT,
//                   cursor: 'pointer',
//                   display: 'flex',
//                 }}
//               >
//                 <X size={18} />
//               </button>
//             )}
//           </div>

//           {/* Nav links */}
//           <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
//             {links.map((link) => {
//               const isActive = activeMenu === link.href
//               return (
//                 <Tooltip key={link.href} delayDuration={0}>
//                   <TooltipTrigger asChild>
//                     <button
//                       onClick={() => handleNav(link.href)}
//                       style={{
//                         width: '100%',
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: 12,
//                         padding: collapsed && isLarge ? '10px 0' : '10px 14px',
//                         justifyContent:
//                           collapsed && isLarge ? 'center' : 'flex-start',
//                         borderRadius: 8,
//                         border: 'none',
//                         background: isActive ? ACTIVE_BG : 'transparent',
//                         color: isActive ? '#fff' : SIDEBAR_TEXT,
//                         cursor: 'pointer',
//                         marginBottom: 2,
//                         fontSize: 14,
//                         fontWeight: isActive ? 600 : 400,
//                         transition: 'background 150ms',
//                         borderLeft: isActive
//                           ? `3px solid ${GOLD}`
//                           : '3px solid transparent',
//                       }}
//                       onMouseEnter={(e) => {
//                         if (!isActive)
//                           (e.currentTarget as HTMLElement).style.background =
//                             HOVER_BG
//                       }}
//                       onMouseLeave={(e) => {
//                         if (!isActive)
//                           (e.currentTarget as HTMLElement).style.background =
//                             'transparent'
//                       }}
//                     >
//                       <link.icon size={18} />
//                       {(!collapsed || !isLarge) && (
//                         <span style={{ whiteSpace: 'nowrap' }}>
//                           {link.name}
//                         </span>
//                       )}
//                     </button>
//                   </TooltipTrigger>
//                   {collapsed && isLarge && (
//                     <TooltipContent side="right">
//                       <p>{link.name}</p>
//                     </TooltipContent>
//                   )}
//                 </Tooltip>
//               )
//             })}
//           </nav>

//           {/* Collapse toggle — desktop only */}
//           {isLarge && (
//             <button
//               onClick={() => setCollapsed(!collapsed)}
//               style={{
//                 margin: '0 8px 12px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: 10,
//                 padding: '9px 14px',
//                 borderRadius: 8,
//                 border: 'none',
//                 background: 'transparent',
//                 color: SIDEBAR_TEXT,
//                 cursor: 'pointer',
//                 fontSize: 13,
//                 justifyContent: collapsed ? 'center' : 'flex-start',
//               }}
//               onMouseEnter={(e) =>
//                 (e.currentTarget.style.background = HOVER_BG)
//               }
//               onMouseLeave={(e) =>
//                 (e.currentTarget.style.background = 'transparent')
//               }
//             >
//               <ChevronLeft
//                 size={18}
//                 style={{
//                   transform: collapsed ? 'rotate(180deg)' : 'none',
//                   transition: 'transform 280ms',
//                 }}
//               />
//               {!collapsed && <span>Collapse</span>}
//             </button>
//           )}
//         </aside>

//         {/* ── Header ───────────────────────────────────────────── */}
//         <header
//           style={{
//             position: 'fixed',
//             top: 0,
//             left: isLarge ? desktopW : 0,
//             right: 0,
//             height: HEADER_H,
//             background: SIDEBAR_BG,
//             color: SIDEBAR_TEXT,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             padding: '0 20px 0 16px',
//             zIndex: 45,
//             transition: 'left 280ms ease',
//             borderBottom: '1px solid rgba(255,255,255,0.08)',
//           }}
//         >
//           {/* Left: hamburger + page title */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
//             {!isLarge && (
//               <button
//                 onClick={() => setMobileOpen(true)}
//                 style={{
//                   background: 'none',
//                   border: 'none',
//                   color: SIDEBAR_TEXT,
//                   cursor: 'pointer',
//                   display: 'flex',
//                 }}
//               >
//                 <Menu size={22} />
//               </button>
//             )}
//             <h1
//               style={{
//                 margin: 0,
//                 fontSize: 20,
//                 fontWeight: 600,
//                 color: '#fff',
//                 textTransform: 'capitalize',
//                 letterSpacing: '0.01em',
//               }}
//             >
//               {pageTitle}
//             </h1>
//             {userType === 'staff' && (
//               <span
//                 style={{
//                   fontSize: 11,
//                   padding: '2px 10px',
//                   borderRadius: 20,
//                   background: 'rgba(201,162,39,0.2)',
//                   color: GOLD,
//                   fontWeight: 600,
//                 }}
//               >
//                 Staff Access
//               </span>
//             )}
//           </div>

//           {/* Right: search + bell + user + logout */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//             {/* Search bar — hidden on small screens */}
//             <div
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: 8,
//                 background: 'rgba(255,255,255,0.08)',
//                 borderRadius: 8,
//                 padding: '6px 14px',
//                 border: '1px solid rgba(255,255,255,0.12)',
//               }}
//               className="hidden-mobile"
//             >
//               <Search size={14} style={{ opacity: 0.6 }} />
//               <input
//                 placeholder="Search"
//                 style={{
//                   background: 'none',
//                   border: 'none',
//                   outline: 'none',
//                   color: SIDEBAR_TEXT,
//                   fontSize: 13,
//                   width: 160,
//                 }}
//               />
//             </div>

//             {/* Bell icon */}
//             <button
//               style={{
//                 background: 'rgba(255,255,255,0.08)',
//                 border: '1px solid rgba(255,255,255,0.12)',
//                 borderRadius: 8,
//                 padding: '7px 10px',
//                 color: SIDEBAR_TEXT,
//                 cursor: 'pointer',
//                 display: 'flex',
//               }}
//             >
//               <Bell size={16} />
//             </button>

//             {/* + Master button */}
//             <button
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: 6,
//                 background: GOLD,
//                 border: 'none',
//                 borderRadius: 8,
//                 padding: '7px 14px',
//                 color: '#1a1a1a',
//                 fontWeight: 700,
//                 fontSize: 13,
//                 cursor: 'pointer',
//               }}
//             >
//               <Plus size={14} />
//               Master
//             </button>

//             {/* Avatar / user initials */}
//             <div
//               style={{
//                 width: 32,
//                 height: 32,
//                 borderRadius: '50%',
//                 background: GOLD,
//                 color: '#1a1a1a',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 fontSize: 13,
//                 fontWeight: 700,
//                 flexShrink: 0,
//               }}
//             >
//               {session
//                 ? ((userType === 'staff'
//                     ? session.staffName
//                     : session.adminName
//                   )
//                     ?.slice(0, 2)
//                     .toUpperCase() ?? 'KP')
//                 : 'KP'}
//             </div>

//             {/* Logout */}
//             <AlertDialog>
//               <AlertDialogTrigger asChild>
//                 <button
//                   disabled={logoutMutation.isPending}
//                   style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: 6,
//                     background: 'none',
//                     border: 'none',
//                     color: SIDEBAR_TEXT,
//                     cursor: 'pointer',
//                     fontSize: 13,
//                     opacity: logoutMutation.isPending ? 0.5 : 1,
//                   }}
//                 >
//                   <LogOut size={16} />
//                   <span className="hidden-mobile">
//                     {logoutMutation.isPending ? 'Logging out…' : 'LogOut'}
//                   </span>
//                 </button>
//               </AlertDialogTrigger>
//               <AlertDialogContent>
//                 <AlertDialogHeader>
//                   <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
//                   <AlertDialogDescription>
//                     Are you sure you want to log out? You will need to sign in
//                     again to access your account.
//                   </AlertDialogDescription>
//                 </AlertDialogHeader>
//                 <AlertDialogFooter>
//                   <AlertDialogCancel>Cancel</AlertDialogCancel>
//                   <AlertDialogAction
//                     onClick={() => logoutMutation.mutate()}
//                     disabled={logoutMutation.isPending}
//                   >
//                     {logoutMutation.isPending ? 'Logging out…' : 'Logout'}
//                   </AlertDialogAction>
//                 </AlertDialogFooter>
//               </AlertDialogContent>
//             </AlertDialog>
//           </div>
//         </header>

//         {/* ── Main content ─────────────────────────────────────── */}
//         <main
//           style={{
//             marginLeft: isLarge ? desktopW : 0,
//             marginTop: HEADER_H,
//             minHeight: `calc(100vh - ${HEADER_H}px)`,
//             padding: '24px',
//             transition: 'margin-left 280ms ease',
//             background: '#f4f6f8',
//           }}
//         >
//           <Outlet />
//           <Toaster position="top-right" />
//         </main>

//         {/* Responsive helpers */}
//         <style>{`
//         @media (max-width: 640px) {
//           .hidden-mobile { display: none !important; }
//         }
//       `}</style>
//       </div>
//     </TooltipProvider>
//   )
// }
import {
  ChevronLeft,
  Home,
  Bell,
  LogOut,
  Menu,
  Search,
  Plus,
  Upload,
  X,
  LayoutDashboard,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { Toaster } from '@/components/ui/sonner'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { _axios } from '@/lib/axios'

interface NavLink {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string; size?: number }>
}

const allLinks: NavLink[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Notification', href: '/notifications', icon: Bell },
  // { name: 'Customer Management', href: '/customer-management', icon: Users },
]

interface LayoutProps {
  session?: any
  userType?: 'admin' | 'staff' | null
}

/* ── height of the top header bar ── */
const HEADER_H = 56
/* ── widths of the left sidebar ── */
const SIDEBAR_FULL = 220
const SIDEBAR_ICON = 64

export default function Layout({ session, userType }: LayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()

  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isLarge, setIsLarge] = useState(true)
  const [activeMenu, setActiveMenu] = useState('/')
  const [links, setLinks] = useState<NavLink[]>(allLinks)

  /* route guard for staff */
  useEffect(() => {
    if (userType === 'staff' && session?.allowedRoutes) {
      const allowed = session.allowedRoutes as string[]
      setLinks(allLinks.filter((l) => allowed.includes(l.href)))
      if (!allowed.includes(location.pathname)) navigate({ to: '/' })
    } else {
      setLinks(allLinks)
    }
  }, [userType, session, location.pathname])

  /* track active segment */
  useEffect(() => {
    const seg = location.pathname.split('/')[1]
    setActiveMenu(seg ? `/${seg}` : '/')
  }, [location.pathname])

  /* responsive */
  useEffect(() => {
    const onResize = () => setIsLarge(window.innerWidth >= 1024)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return (await _axios.post('/admin/auth/logout')).data
    },
    onSuccess: () => {
      toast.success('Logged out successfully')
      queryClient.invalidateQueries({ queryKey: ['session'] })
      navigate({ to: '/login' })
    },
    onError: () => toast.error('Logout failed. Please try again.'),
  })

  const handleNav = (path: string) => {
    navigate({ to: path })
    setMobileOpen(false)
  }

  const pageTitle = location.pathname.split('/')[1]
    ? location.pathname.split('/')[1].replace(/-/g, ' ')
    : 'Dashboard'

  const desktopSidebarW = collapsed ? SIDEBAR_ICON : SIDEBAR_FULL

  return (
    <TooltipProvider>
      <div
        className="min-h-screen"
        style={{ background: 'var(--kp-content-bg)' }}
      >
        {/* ── Mobile backdrop ─────────────────────────────── */}
        {!isLarge && mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* ══════════════════════════════════════════════════
          SIDEBAR
      ══════════════════════════════════════════════════ */}
        <aside
          className="fixed top-0 left-0 bottom-0 z-50 flex flex-col overflow-hidden transition-all duration-300"
          style={{
            width: isLarge ? desktopSidebarW : SIDEBAR_FULL,
            background: 'var(--kp-sidebar-bg)',
            // borderRight: '1px solid var(--kp-sidebar-border)',
            transform: isLarge
              ? 'translateX(0)'
              : mobileOpen
                ? 'translateX(0)'
                : `translateX(-${SIDEBAR_FULL}px)`,
          }}
        >
          {/* ── Logo area — same teal as the header ── */}
          <div
            className="flex items-center gap-3 shrink-0 px-1"
            style={{
              height: HEADER_H,
              background: 'var(--kp-header-bg)',
            }}
          >
            {/* KP badge */}
            <img
              src="/KPLogo.png"
              className="w-18 h-14 py-1 "
              alt="Elite KP Jewellery"
              role="presentation"
              aria-hidden
              loading="lazy"
              decoding="async"
            />

            {/* Brand text — hide when icon-only */}
            {(!collapsed || !isLarge) && (
              <div className="overflow-hidden">
                <p
                  className="text-xs font-bold tracking-wide leading-tight truncate"
                  style={{ color: '#ffffff' }}
                >
                  ELITE KP JEWELLERY
                </p>
                <p
                  className="text-[10px] truncate"
                  style={{ color: 'var(--kp-gold)' }}
                >
                  ஆபரணம் Creators
                </p>
              </div>
            )}

            {/* Mobile close */}
            {!isLarge && (
              <button
                className="ml-auto flex items-center justify-center"
                style={{ color: 'var(--kp-header-fg)' }}
                onClick={() => setMobileOpen(false)}
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* ── Nav items ── */}
          <nav className="flex-1 overflow-y-auto py-3 px-2">
            {links.map((link) => {
              const isActive = activeMenu === link.href
              return (
                <Tooltip key={link.href} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleNav(link.href)}
                      className="w-full flex items-center cursor-pointer  gap-3 rounded-md mb-0.5 transition-colors duration-150 text-sm font-medium"
                      style={{
                        padding: collapsed && isLarge ? '9px 0' : '9px 12px',
                        justifyContent:
                          collapsed && isLarge ? 'center' : 'flex-start',
                        background: isActive
                          ? 'var(--kp-sidebar-active-bg)'
                          : 'transparent',
                        color: isActive
                          ? 'var(--kp-sidebar-active-fg)'
                          : 'var(--kp-sidebar-fg)',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive)
                          (e.currentTarget as HTMLElement).style.background =
                            'var(--kp-sidebar-hover-bg)'
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive)
                          (e.currentTarget as HTMLElement).style.background =
                            'transparent'
                      }}
                    >
                      <link.icon size={17} />
                      {(!collapsed || !isLarge) && (
                        <span className="truncate">{link.name}</span>
                      )}
                    </button>
                  </TooltipTrigger>
                  {collapsed && isLarge && (
                    <TooltipContent side="right">
                      <p>{link.name}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              )
            })}
          </nav>

          {/* ── Desktop collapse toggle ── */}
          {isLarge && (
            <div
              className="shrink-0 p-2"
              style={{ borderTop: '1px solid var(--kp-sidebar-border)' }}
            >
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors"
                style={{
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  color: 'var(--kp-sidebar-muted)',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    'var(--kp-sidebar-hover-bg)')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    'transparent')
                }
              >
                <ChevronLeft
                  size={16}
                  style={{
                    transform: collapsed ? 'rotate(180deg)' : 'none',
                    transition: 'transform 280ms',
                  }}
                />
                {!collapsed && <span>Collapse</span>}
              </button>
            </div>
          )}
        </aside>

        {/* ══════════════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════════════ */}
        <header
          className="fixed top-0 right-0 z-45 flex items-center justify-between px-5 transition-all duration-300"
          style={{
            left: isLarge ? desktopSidebarW : 0,
            height: HEADER_H,
            background: 'var(--kp-header-bg)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Left */}
          <div className="flex items-center gap-3 px-5">
            {!isLarge && (
              <button
                className="flex"
                style={{ color: 'var(--kp-header-fg)' }}
                onClick={() => setMobileOpen(true)}
              >
                <Menu size={22} />
              </button>
            )}
            <h1
              className="text-lg font-semibold capitalize tracking-wide"
              style={{ color: '#ffffff', margin: 0 }}
            >
              {pageTitle}
            </h1>
            {userType === 'staff' && (
              <span
                className="hidden md:inline-flex text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{
                  background: 'rgba(201,162,39,0.2)',
                  color: 'var(--kp-gold)',
                }}
              >
                Staff Access
              </span>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2.5">
            {/* Search */}
            <div
              className="hidden md:flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'var(--kp-header-fg)',
              }}
            >
              <Search size={13} style={{ opacity: 0.6 }} />
              <input
                placeholder="Search"
                className="bg-transparent border-none outline-none text-sm w-36"
                style={{ color: 'var(--kp-header-fg)' }}
              />
            </div>

            {/* Bell */}
            <button
              className="flex items-center justify-center rounded-lg p-2 cursor-pointer"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'var(--kp-header-fg)',
              }}
            >
              <Bell size={16} />
            </button>

            {/* + Master */}
            <button
              className="hidden sm:flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm  cursor-pointer transition-opacity hover:opacity-90"
              style={{
                background: 'var(--kp-gold)',
                color: 'white',
                border: 'none',
              }}
            >
              <Plus size={14} />
              Master
            </button>

            <button
              className="flex items-center justify-center rounded-lg p-2 text-[14px]"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'var(--kp-header-fg)',
              }}
            >
              KP
            </button>

            {/* User initials */}
            {/* <div
              className="flex items-center justify-center rounded-full text-xs font-bold shrink-0"
              style={{
                width: 32,
                height: 32,
                background: 'var(--kp-gold)',
                color: '#1a1a1a',
              }}
            >
              {session
                ? ((userType === 'staff'
                    ? session.staffName
                    : session.adminName
                  )
                    ?.slice(0, 2)
                    .toUpperCase() ?? 'KP')
                : 'KP'}
            </div> */}

            {/* Logout */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  disabled={logoutMutation.isPending}
                  className="flex items-center gap-1.5 text-sm cursor-pointer transition-opacity hover:opacity-70 disabled:opacity-50"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--kp-header-fg)',
                  }}
                >
                  <LogOut size={16} />
                  <span className="hidden md:inline">
                    {logoutMutation.isPending ? 'Logging out…' : 'LogOut'}
                  </span>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to log out? You will need to sign in
                    again to access your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                    className="cursor-pointer"
                  >
                    {logoutMutation.isPending ? 'Logging out…' : 'Logout'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </header>

        {/* ══════════════════════════════════════════════════
          MAIN CONTENT  — padded below header, left of sidebar
      ══════════════════════════════════════════════════ */}
        <main
          className="transition-all duration-300"
          style={{
            marginLeft: isLarge ? desktopSidebarW : 0,
            paddingTop: HEADER_H,
            minHeight: '100vh',
            background: 'var(--kp-content-bg)',
          }}
        >
          {/* inner white card — matches the screenshot */}
          <div
            className=" overflow-hidden"
            style={{
              background: '#ffffff',
              border: '1px solid var(--kp-sidebar-border)',
              minHeight: `calc(100vh - ${HEADER_H}px)`,
            }}
          >
            <Outlet />
          </div>

          <Toaster position="top-right" />
        </main>
      </div>
    </TooltipProvider>
  )
}
