import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as fs from "fs";
import * as path from "path";
import archiver from "archiver"

// Create an S3 bucket for hosting the website
const siteBucket = new aws.s3.Bucket("myFrontendBucket", {
    website: {
        indexDocument: "index.html",
        errorDocument: "error.html",
    },
});

// Upload files to S3 (Assuming 'dist' directory after build)
const siteDir = "./build";  // Path to frontend build output
const archivePath = path.join(siteDir, "site-archive.zip");

const output = fs.createWriteStream(archivePath);
const archive = archiver("zip");

output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('Archiver has been finalized and the output file descriptor has closed.');
});

archive.on('error', function(err){
    throw err;
});

archive.pipe(output);
archive.directory(siteDir, false);
archive.finalize();

// Upload the archive to the bucket
new aws.s3.BucketObject("site-archive", {
    bucket: siteBucket,
    source: new pulumi.asset.FileAsset(archivePath),
    acl: "public-read", // Make file publicly readable
});

// Output the bucket website URL
exports.websiteUrl = siteBucket.websiteEndpoint;