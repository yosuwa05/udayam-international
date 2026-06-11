import {
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { APP_CONSTANTS } from "constant";
import { Readable } from "stream";

export const s3Client = new S3Client({
    region: APP_CONSTANTS.REGION as string,
    credentials: {
        accessKeyId: APP_CONSTANTS.AWS_ACCESS_KEY as string,
        secretAccessKey: APP_CONSTANTS.AWS_SECRET_ACCESS_KEY as string,
    },
});

const bucketName = APP_CONSTANTS.BUCKET_NAME;

export const saveFile = async (
    blob: Blob | any,
    parentFolder: string,
    subFolder?: string,
    keyString = ""
): Promise<{ ok: boolean; filename: string; url?: string }> => {
    try {
        if (!blob) {
            return { ok: false, filename: "", url: "" };
        }

        const hash =
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);

        let filename: string;
        if (subFolder) {
            filename = keyString
                ? `${parentFolder}/${subFolder}/${Date.now()}-${keyString}-${blob.name}`
                : `${parentFolder}/${subFolder}/${Date.now()}-${hash}-${blob.name}`;
        } else {
            filename = keyString
                ? `${parentFolder}/${Date.now()}-${keyString}-${blob.name}`
                : `${parentFolder}/${Date.now()}-${hash}-${blob.name}`;
        }

        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        await s3Client.send(
            new PutObjectCommand({
                Bucket: bucketName,
                Key: filename,
                Body: buffer,
                ContentType: blob.type,
            })
        );

        const bucketRegion = process.env.REGION as string // Replace with your bucket's region
        const baseUrl = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com`;
        const fullUrl = `${baseUrl}/${filename}`;

        return { ok: true, filename: fullUrl };
    } catch (error) {
        console.error(error);
        return { ok: false, filename: "" };
    }
};

export const deleteFile = async (key: any) => {
    try {
        await s3Client.send(
            new DeleteObjectCommand({
                Bucket: bucketName,
                Key: key,
            })
        );

        return {
            ok: true,
        };
    } catch (error) {
        console.error(error);
        return {
            ok: false,
        };
    }
};

export const deliverFile = async (filename: string) => {
    try {
        if (!bucketName || !filename) {
            throw new Error("Bucket name or filename is missing");
        }

        let url = await getSignedUrl(
            s3Client,
            new GetObjectCommand({
                Bucket: bucketName,
                Key: filename,
                ResponseContentDisposition: "inline",
                ResponseContentType: "application/octet-stream",
            }),
            {
                expiresIn: 3600,
            }
        );

        if (!url) {
            return {
                ok: false,
                data: [],
            };
        }

        return {
            data: url,
            ok: true,
        };
    } catch (error) {
        console.error("Error in deliverFile:", error);
        return {
            ok: false,
            data: [],
        };
    }
};

export const getAsBlob = async (filename: string) => {
    try {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: filename,
        });

        const data = await s3Client.send(command);

        const stream = data.Body as Readable;
        const chunks: Buffer[] = [];

        for await (const chunk of stream) {
            chunks.push(chunk);
        }

        const buffer = Buffer.concat(chunks);

        return {
            data: buffer,
            ok: true,
        };
    } catch (error) {
        console.error(error);

        return {
            ok: false,
            data: null,
        };
    }
};