import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

// Create an S3 bucket for hosting the website
const siteBucket = new aws.s3.Bucket("myFrontendBucket", {
    website: {
        indexDocument: "index.html",
        errorDocument: "error.html",
    },
});

// Upload files to S3 (Assuming 'dist' directory after build)
const siteDir = "./build";  // Path to frontend build output
// const siteFiles = new pulumi.asset.FileArchive(siteDir);

fs.readdirSync(siteDir).forEach(file => {
    const filePath = path.join(siteDir, file);
    new aws.s3.BucketObject(file, {
        bucket: siteBucket,
        source: new pulumi.asset.FileAsset(filePath),
        acl: "public-read", // Make file publicly readable
    });
});

// new aws.s3.BucketObject("websiteFiles", {
//     bucket: siteBucket.id,
//     source: siteFiles,
// });

// Enable public access for the S3 bucket
new aws.s3.BucketPolicy("bucketPolicy", {
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
