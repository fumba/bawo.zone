
// Copyright 2010-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
//
// This file is licensed under the Apache License, Version 2.0 (the "License").
// You may not use this file except in compliance with the License. A copy of the
// License is located at
//
// http://aws.amazon.com/apache2.0/
//
// This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
// OF ANY KIND, either express or implied. See the License for the specific
// language governing permissions and limitations under the License.

// To install stable release of RxJS: npm install rxjs
// To install TypeStrong/ts-node: npm install -D ts-node
// To install AWS SDK: npm install aws-sdk
//
// This CRUD API can be used in an Angular 2+ service
// To create Angular service: ng generate service [Name of service]
// See https://angular.io/tutorial/toh-pt4 for more information on Angular services
// Can be implemented inside ReactJS or React Native components to easily manage asynchronous data streams
// See https://hackernoon.com/what-happens-when-you-use-rxjs-in-react-11ae5163fc0a for more information

import  S3 from 'aws-sdk/clients/s3';

class File {
  name: string;
  url: string;

  constructor(name: string, url: string) {
    this.name = name;
    this.url = url;
  }
  result: any[];
}

class S3Controller {
  FOLDER = '/* s3-folder-name */'; // For example, 'my_folder'.
  BUCKET = '/* s3-bucket-name */'; // For example, 'my_bucket'.

  private static getS3Bucket(): any {
    return new S3(
      {
        accessKeyId: '/* access key here */', // For example, 'AKIXXXXXXXXXXXGKUY'.
        secretAccessKey: '/* secret key here */', // For example, 'm+XXXXXXXXXXXXXXXXXXXXXXDDIajovY+R0AGR'.
        region: '/* region here */' // For example, 'us-east-1'.
      }
    );
  }

  public uploadFile(file:File) {
    const bucket = new S3(
      {
        accessKeyId: '/* access key here */',
        secretAccessKey: '/* secret key here */',
        region: '/* region here */'
      }
    );

    const params = {
      Bucket: this.BUCKET,
      Key: this.FOLDER + file.name,
      Body: file,
      ACL: 'public-read'
    };

    bucket.upload(params, function (err:any, data:any) {
      if (err) {
        console.log('There was an error uploading your file: ', err);
        return false;
      }
      console.log('Successfully uploaded file.', data);
      return true;
    });
  }
}

new S3Controller().uploadFile(new File('test', '/test.txt'))
