import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as fs from "fs";
import * as path from "path";
import mime from "mime"; // Ensure mime is installed with `npm install mime`

// Create an S3 bucket with website hosting
const bucket = new aws.s3.Bucket("myFrontendBucket", {
    website: {
        indexDocument: "index.html",
        errorDocument: "index.html",
    },
});

// Function to recursively get all files in a directory
function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    files.forEach((file) => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            arrayOfFiles.push(fullPath);
        }
    });
    return arrayOfFiles;
}

// Define build directory
const siteDir = "./build";
const files = getAllFiles(siteDir, []);

// Upload each file to S3
files.forEach((file) => {
    const relativeFilePath = path.relative(siteDir, file); // Get path relative to build directory
    new aws.s3.BucketObject(relativeFilePath, {
        bucket: bucket,
        source: new pulumi.asset.FileAsset(file),
        contentType: mime.getType(file) || "application/octet-stream",
    });
});

// Apply a public bucket policy
new aws.s3.BucketPolicy("bucketPolicy", {
    bucket: bucket.id,
    policy: bucket.id.apply((id) =>
        JSON.stringify({
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: "Allow",
                    Principal: "*",
                    Action: "s3:GetObject",
                    Resource: `arn:aws:s3:::${id}/*`,
                },
            ],
        })
    ),
});

// Export the bucket website URL
export const bucketEndpoint = pulumi.interpolate`http://${bucket.websiteEndpoint}`;
