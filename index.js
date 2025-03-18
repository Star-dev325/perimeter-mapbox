import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

// Create an S3 bucket for hosting the website
const siteBucket = new aws.s3.Bucket("myFrontendBucket", {
    website: {
        indexDocument: "index.html",
    },
});

// Upload files to S3 (Assuming 'dist' directory after build)
const siteDir = "./build";  // Path to frontend build output
const siteFiles = new pulumi.asset.FileArchive(siteDir);

new aws.s3.BucketObject("websiteFiles", {
    bucket: siteBucket.id,
    key: "websiteFiles",
    source: siteFiles,
});

// Enable public access for the S3 bucket
const bucketPolicy = new aws.s3.BucketPolicy("bucketPolicy", {
    bucket: siteBucket.id,
    policy: siteBucket.id.apply(id => JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
            Effect: "Allow",
            Principal: "*",
            Action: ["s3:GetObject"],
            Resource: [`arn:aws:s3:::${id}/*`],
        }],
    })),
});

// Export bucket URL
export const bucketEndpoint = siteBucket.websiteEndpoint;
