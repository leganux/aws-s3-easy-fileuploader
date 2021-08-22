let easy_aws_upload = require('./index')

let AWS_ID = 'AKIAQYOGEZOH6HS6NZRF';
let AWS_KEY = 'XGfSNlfG+zaFssopyoH2MeoJYFRAKO4VBlbhFWh/';
let AWS_REGION = 'us-east-2';

let path = require('path')


let my_bucket = new easy_aws_upload({
    AWS_ID,
    AWS_KEY,
    AWS_REGION,
    S3_BUCKET_NAME: 'PaquitaCabeza',
    FLAVOR: 'custom,date,alphabet',
    MAKE_THUMBNAIL: {
        width: 200,
        height: 200
    },
    // SUFFIX_COUNT: 3,
    // PREPEND_RANDOM: 5,
    S3_ACL: 'public-read'

})

let init = async function () {
    my_bucket.init()
    //let Location = await my_bucket.createBucket()
    //console.log('la location ', Location)
    //let upload = await my_bucket.uploadFile(path.join(__dirname, 'index.js'), 'index', 'js')
    //console.log('Uploaded ', upload)
    let upload2 = await my_bucket.uploadFromURL('https://www.nippon.com/es/ncommon/contents/japan-topics/560508/560508.jpg', 'woman.png', 'images')
    console.log('Uploaded ', upload2)
    // let delete_ = await my_bucket.deleteFile('2021/08/21/sheryl.png')
    //console.log('DELETED ', delete_)
    //let get = await my_bucket.getFile('2021/08/21/sheryl.png')
    //console.log('base64 ',get) //get.Body.toString('base64')

}

init()




