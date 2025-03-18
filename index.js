const pulumi = require("@pulumi/pulumi");
const aws = require("@pulumi/aws");
const fs = require("fs");
const path = require("path");

// Create an S3 bucket
const siteBucket = new aws.s3.Bucket("my-site-bucket", {
    website: {
        indexDocument: "index.html",
        errorDocument: "error.html",
    },
});

// Archive the directory
const siteDir = "./build"; // Replace with your website directory
const archivePath = path.join(siteDir, "site-archive.zip");

const archiver = require("archiver");
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