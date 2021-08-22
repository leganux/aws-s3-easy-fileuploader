const AWS = require('aws-sdk');
const {promisify} = require('util');
const {uniqueNamesGenerator, adjectives, colors, animals} = require('unique-names-generator');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const axios = require('axios');
const FileDownload = require('js-file-download');
const imageThumbnail = require('image-thumbnail');


module.exports = function (options) {
    let {
        AWS_ID,
        AWS_KEY,
        AWS_REGION,
        S3_BUCKET_NAME,
        FLAVOR,
        SUFFIX_COUNT,
        PREPEND_RANDOM,
        S3_ACL,
        MAKE_THUMBNAIL
    } = options

    if (!AWS_ID || !AWS_KEY) {
        throw  new Error('You must to configure aws ID and aws Key')
        return
    }

    if (!AWS_REGION) {
        AWS_REGION = 'us-east-2'
    }
    if (typeof MAKE_THUMBNAIL == 'boolean' && MAKE_THUMBNAIL == true) {
        MAKE_THUMBNAIL = {}
    }

    if (MAKE_THUMBNAIL) {
        if (!MAKE_THUMBNAIL.percentage && !MAKE_THUMBNAIL.width && !MAKE_THUMBNAIL.height) {
            MAKE_THUMBNAIL.percentage = 10
        }
        MAKE_THUMBNAIL.responseType = 'buffer'
        MAKE_THUMBNAIL.failOnError = false
        MAKE_THUMBNAIL.withMetaData = false
        MAKE_THUMBNAIL.fit = 'cover'
        /*MAKE_THUMBNAIL.jpegOptions = {
            force: true,
            quality: 80
        }*/
    }

    if (!S3_ACL) {
        S3_ACL = 'public-read'
    }
    if (!SUFFIX_COUNT) {
        SUFFIX_COUNT = 3
    }

    if (!S3_BUCKET_NAME) {
        S3_BUCKET_NAME = uniqueNamesGenerator({
            dictionaries: [adjectives, colors, animals],
            separator: '-',
            length: 2,
        }).toLowerCase();
    } else {
        S3_BUCKET_NAME = String(S3_BUCKET_NAME).toLowerCase()
    }

    if (!FLAVOR) {
        FLAVOR == 'root'
    }


    this.ID = AWS_ID;
    this.KEY = AWS_KEY;
    this.REGION = AWS_REGION;
    this.BUCKET = S3_BUCKET_NAME;
    this.S3 = false;
    this.PARAMS = false;
    this.LOCATION = false;
    this.BUCKET_DATA = false;
    this.FLAVOR = FLAVOR;
    this.SUFFIX_COUNT = SUFFIX_COUNT;
    this.RANDOM = PREPEND_RANDOM;
    this.S3_ACL = S3_ACL;
    this.THUMB = MAKE_THUMBNAIL;

    this.makeid = function (length = 3) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }
    this.init = function () {
        try {
            let el = this;
            el.S3 = new AWS.S3({
                accessKeyId: el.ID,
                secretAccessKey: el.KEY
            });
        } catch (e) {
            throw  e
        }
    }
    this.createBucket = async function () {
        let el = this;
        el.PARAMS = {
            Bucket: el.BUCKET,
            CreateBucketConfiguration: {
                LocationConstraint: el.REGION
            }
        };
        try {
            let createBucket = promisify(el.S3.createBucket).bind(el.S3);
            let data = await createBucket(el.PARAMS);
            el.LOCATION = data.Location;
            el.BUCKET_DATA = data;
            return data;

        } catch (e) {
            if (e.code == 'BucketAlreadyOwnedByYou') {
                return false
            } else {
                throw e
            }
        }
    }
    this.deleteBucket = async function () {
        try {
            let el = this
            let params = {
                Bucket: el.BUCKET
            };
            let deleteBucket = promisify(el.S3.deleteBucket).bind(el.S3)
            return await deleteBucket(params)
        } catch (e) {
            throw e
        }
    }
    this.deleteFile = async function (key) {
        try {
            let el = this;
            if (!key) {
                throw new Error('Please insert the key')
            }
            let params = {
                Bucket: el.BUCKET,
                Key: key
            };
            let deleteObject = promisify(el.S3.deleteObject).bind(el.S3)
            return await deleteObject(params)

        } catch (e) {
            throw e
        }

    }
    this.getFile = async function (key) {
        try {
            let el = this;
            if (!key) {
                throw new Error('Please insert the key')
            }
            let params = {
                Bucket: el.BUCKET,
                Key: key
            };
            let getObject = promisify(el.S3.getObject).bind(el.S3)
            return await getObject(params)

        } catch (e) {
            throw e
        }

    }
    this.uploadFile = async function (filePath, name, customFolder = 'custom') {
        let el = this;
        try {
            let file = fs.readFileSync(filePath)
            if (!name) {
                name = path.basename(filePath)
            }
            let ext = path.extname(filePath).replace('.', '')

            console.log(name, ext, filePath)

            let nameFile = name
            if (el.RANDOM && typeof (el.RANDOM) == 'number') {
                nameFile = el.makeid(el.RANDOM) + name
            }


            let string_folder = ''
            let runFlavors = el.FLAVOR.split(',')

            for (let item of runFlavors) {
                switch (item.toLowerCase().trim()) {
                    case "date":
                        string_folder = string_folder + moment().format('YYYY') + '/' + moment().format('MM') + '/' + moment().format('DD') + '/'
                        break;
                    case "custom":
                        string_folder = string_folder + customFolder + '/'
                        break;
                    case "filetype":
                        string_folder = string_folder + ext + '/'
                        break;
                    case "alphabet":
                        string_folder = string_folder + name.substr(0, 1).toLowerCase() + '/'
                        break;
                    case "suffix":
                        string_folder = string_folder + name.substr(0, el.SUFFIX_COUNT) + '/'
                        break;
                    default:
                        string_folder = string_folder + ''
                        break;

                }
            }


            let nameFile_file = string_folder + nameFile;

            let ext_ = ext.toLowerCase()
            let thumb_ = false
            let upload = promisify(el.S3.upload).bind(el.S3);
            console.log('Extension', ext)
            if (el.THUMB && (['jpg', 'png', 'gif', 'jpeg', 'bmp', 'webp'].includes(ext_))) {
                let thumbnail = await imageThumbnail(file, el.THUMB)
                let nameFile_thumb = string_folder + 'thumbnails/' + 'thumb_' + nameFile;
                let thumb_params = {
                    Bucket: el.BUCKET,
                    Key: (nameFile_thumb.includes('.') ? nameFile_thumb : (nameFile_thumb + '.' + ext)),
                    Body: thumbnail,
                    ACL: el.S3_ACL
                };
                thumb_ = await upload(thumb_params)
            }


            let params = {
                Bucket: el.BUCKET,
                Key: (nameFile_file.includes('.') ? nameFile_file : (nameFile_file + '.' + ext)),
                Body: file,
                ACL: el.S3_ACL
            };

            let uploadedFile = await upload(params)
            return {
                file: uploadedFile,
                thumbnail: thumb_
            }

        } catch (e) {
            throw e
        }

    }
    this.uploadFromURL = async function (URL, name_, customFolder = 'custom') {
        try {
            let el = this;


            let ext = ''
            let name = ''
            if (URL.includes('/')) {
                name = URL.split('/')[((URL.split('/').length) - 1)]
            }

            if (URL.includes('.')) {
                ext = URL.split('.')[((URL.split('.').length) - 1)]
            }
            if (ext.includes('?')) {
                ext = ext.split('.')[0]
            }

            if (name.includes('?')) {
                name = name.split('.')[0]
            }

            let path_ = path.resolve(__dirname, 'temp.' + ext)
            let writer = fs.createWriteStream(path_)

            let response = await axios({
                url: URL,
                method: 'GET',
                responseType: 'stream',
            });

            response.data.pipe(writer)

            await new Promise((resolve, reject) => {
                writer.on('finish', resolve)
                writer.on('error', reject)
            })

            if (name_) {
                name = name_
            }


            let result = await el.uploadFile(path_, name, customFolder)

            fs.unlinkSync(path_)
            return result


        } catch (e) {
            throw e
        }


    }

}
