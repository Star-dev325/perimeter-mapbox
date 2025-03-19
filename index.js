import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as fs from "fs";
import mime from "mime";

// Create an S3 bucket with website hosting
const bucket = new aws.s3.Bucket("myFrontendBucket", {
    website: {
        indexDocument: "index.html",
        errorDocument: "index.html",
    },
});

// Get all files from the "dist" folder and upload them
const siteDir = "./build";
fs.readdirSync(siteDir).forEach(file => {
    new aws.s3.BucketObject(file, {
        bucket: bucket,
        source: new pulumi.asset.FileAsset(`${siteDir}/${file}`),
        contentType: mime.getType(file) || "application/octet-stream"
    });
});

// Apply a public bucket policy
new aws.s3.BucketPolicy("bucketPolicy", {
    bucket: bucket.id,
    policy: bucket.id.apply(id => JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
            Effect: "Allow",
            Principal: "*",
            Action: "s3:GetObject",
            Resource: `arn:aws:s3:::${id}/*`
        }]
    })),
});

// Export the bucket website URL
export const bucketEndpoint = pulumi.interpolate`http://${bucket.websiteEndpoint}`;