# aws-s3-easy-fileuploader

An easy file uploader helper for S3 buckets of aws by leganux

aws-s3-easy-fileuploader is a tool helps you to easily upload public images and files to your AWS S3, includes some
awesome options like

* Easy create / delete a new bucket
* Easy save files in directory structures for example:
  * By Date YYYY/MM/DD
  * By Alphabet
  * By Kind of file (Extension)
  * By suffix
  * Custom
* UPLOAD File
* Generate Image Thumbnails
* Download Files

**Get Started**

Install

```text
npm i aws-s3-easy-fileuploader

```

Import to project

```javascript
let easy_aws_upload = require('aws-s3-easy-fileuploader');

```

Define options object

```javascript
let AWS_ID = 'XXXXXXXXXXXXXXX';
let AWS_KEY = 'XCCCCCXXXXXCCCCCXXXXXXXCCCCCXXX';
let AWS_REGION = 'us-east-2';

let options = {

  AWS_ID,
  AWS_KEY,
  AWS_REGION,
  S3_BUCKET_NAME: 'JaneDoeFolder',
  FLAVOR: 'custom,date,alphabet',
  MAKE_THUMBNAIL: {width: 200, height: 200},
  SUFFIX_COUNT: 3,
  PREPEND_RANDOM: 5,
  S3_ACL: 'public-read'

}



```

**Options**

* AWS_ID (mandatory): Defines the AWS credential ID
* AWS_KEY (mandatory): Defines the AWS credential KEY
* AWS_REGION (optional): Defines the AWS desired region. Default 'us-east-2'
* S3_BUCKET_NAME (optional): Defines the name desired for AWS s3 Bucket. If does't set will create a random name bucket
* FLAVOR (optional): Defines the structure folder where files be stored in. You can use more than 1 flavor (comma
  separed) For example:
  * root (default): All files will be stored in the root folder
  * date : All files will be stored in the folder structure by date /YYY/MM/DD/File.jpg
  * filetype : All files will be stored in the folder structure by extension /jpg/File.jpg
  * alphabet : All files will be stored in the folder structure by A-Z /f/File.jpg
  * suffix : All files will be stored in the folder structure based on suffix of same file /fil/File.jpg
  * custom : All files will be stored in the custom user folder /custom/File.jpg
* MAKE_THUMBNAIL (optional ):[true/false or {width: 200, height: 200}]  If true this will create a thumbnail for images
  Automatically. You can define next parameters.
  * width: thumbnail width in pixels
  * height: thumbnail height in pixels
  * percentage: If you define this parameter width and height will be override, percent of real size for thumbnail
* SUFFIX_COUNT(optional): If suffix flavor declared uses this length for make folders
* PREPEND_RANDOM(optional): Number of random characters that will be added prepend name of file. (useful for files with
  same names)
* S3_ACL: Default 'public-read', You can configure permissions for upload files.

**Instance new element**

```Javascript

let my_bucket = new easy_aws_upload(options)

```

**Initialize AWS Connection**

```Javascript

my_bucket.init()

```

**Create bucket**

If bucket does not exists will be created

```Javascript

let bucket = await my_bucket.createBucket()

```

**Delete Bucket**

If bucket does exists will be deleted

```Javascript

let bucket = await my_bucket.deleteBucket()

```

**Upload File**

If bucket does exists will be deleted Params:

* filePath(mandatory): The local path of file for upload
* name(optional): The name of file
* customFolder(optional): The name of folder if flavor custom is used

```Javascript

let file = await my_bucket.uploadFile('/local/file.jpg', 'myfile', 'custom')

```

**Delete File**

If file does exists will be deleted Params:

* key(mandatory): The AWS key for delete file from s3

```Javascript

let file = await my_bucket.deleteFile('/remote/file.jpg')

```

**Get File**

If file does exists will be downloaded as buffer

Params:

* key(mandatory): The AWS key for delete file from s3

```Javascript

let file = await my_bucket.deleteFile('/remote/file.jpg')

```

<hr>


<p align="center">
    <img src="https://leganux.net/web/wp-content/uploads/2020/01/circullogo.png" width="100" title="hover text">
    <br>
  aws-s3-easy-fileuploader is another project of  <a href="https://leganux.net">leganux.net</a> &copy; 2021 all rights reserved
    <br>
   This project is distributed under the MIT license. 

<br>
<br>

</p>
