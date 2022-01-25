const serviceEVM = require('../services/ether');
const serviceSolana = require('../services/solana');
const {addErrorMessage} = require('../services/errors');
const logger = require('../services/winston');

async function serverStatus(req, res) {
    try {
        const {schid: from_chain_id, tchid: to_chain_id} = req.query;
        let result = await _serverStatus(
            parseInt(from_chain_id),
            parseInt(to_chain_id)
        );
        logger.debug(JSON.stringify(result));
        res.json(addErrorMessage(result));
    } catch (e) {
        logger.debug(JSON.stringify(e));
    }
}

async function _serverStatus(from_chain_id, to_chain_id) {
    try {
        let fromServiceAccount;
        let toServiceAccount;
        if (serviceEVM.isEVMChain(from_chain_id)) {
            fromServiceAccount = serviceEVM.getServiceAccountString(from_chain_id);
        } else {
            fromServiceAccount = serviceSolana.getServiceAccountString();
        }

        if (serviceEVM.isEVMChain(to_chain_id)) {
            toServiceAccount = serviceEVM.getServiceAccountString(to_chain_id);
        } else {
            toServiceAccount = serviceSolana.getServiceAccountString();
        }

        return {
            success: true,
            from_account: fromServiceAccount,
            to_account: toServiceAccount,
        };
    } catch (e) {
        return {success: false};
    }
}

async function dailyWorks(req, res) {
    res.json({
        "message": "success",
        "data": {
            "items": [
                {
                    "id": 30,
                    "shiftDate": "2022-01-27T20:19:45.000Z",
                    "workCategory": "sprayCan",
                    "disposalFacilityId": null,
                    "address": "49846 斎藤 Spur",
                    "timeSpecificationMethod": "amPm",
                    "timeSpecificationMethodOtherText": null,
                    "amOrPm": "pm",
                    "specifiedTime": null,
                    "arriveTime": null,
                    "peopleNumber": 1,
                    "remerkDetail": "payment",
                    "serialNumber": 30
                },
                {
                    "id": 29,
                    "shiftDate": "2022-01-21T16:13:13.000Z",
                    "workCategory": "others",
                    "disposalFacilityId": null,
                    "address": "08530 愛菜 Knoll",
                    "timeSpecificationMethod": "amPm",
                    "timeSpecificationMethodOtherText": null,
                    "amOrPm": "am",
                    "specifiedTime": null,
                    "arriveTime": null,
                    "peopleNumber": 6,
                    "remerkDetail": "Money",
                    "serialNumber": 29
                },
                {
                    "id": 27,
                    "shiftDate": "2022-01-04T13:03:24.000Z",
                    "workCategory": "contract",
                    "disposalFacilityId": null,
                    "address": "9516 田中 Plaza",
                    "timeSpecificationMethod": "amPm",
                    "timeSpecificationMethodOtherText": null,
                    "amOrPm": "am",
                    "specifiedTime": null,
                    "arriveTime": null,
                    "peopleNumber": 4,
                    "remerkDetail": "Sausages",
                    "serialNumber": 27
                },
                {
                    "id": 26,
                    "shiftDate": "2022-01-07T05:37:57.000Z",
                    "workCategory": "officeWork",
                    "disposalFacilityId": null,
                    "address": "2907 小林 Gardens",
                    "timeSpecificationMethod": "afterCall",
                    "timeSpecificationMethodOtherText": null,
                    "amOrPm": null,
                    "specifiedTime": null,
                    "arriveTime": null,
                    "peopleNumber": 3,
                    "remerkDetail": "Mobility",
                    "serialNumber": 26
                },
                {
                    "id": 24,
                    "shiftDate": "2022-01-21T20:15:20.000Z",
                    "workCategory": "officeWork",
                    "disposalFacilityId": null,
                    "address": "5050 伊藤 Bridge",
                    "timeSpecificationMethod": "arriveTime",
                    "timeSpecificationMethodOtherText": null,
                    "amOrPm": null,
                    "specifiedTime": null,
                    "arriveTime": "9:00",
                    "peopleNumber": 2,
                    "remerkDetail": "Pound",
                    "serialNumber": 24
                },
                {
                    "id": 23,
                    "shiftDate": "2022-01-13T09:50:18.000Z",
                    "workCategory": "workInTheHall",
                    "disposalFacilityId": null,
                    "address": "4743 愛菜 Lake",
                    "timeSpecificationMethod": "specifiedTime",
                    "timeSpecificationMethodOtherText": null,
                    "amOrPm": null,
                    "specifiedTime": "12:00",
                    "arriveTime": null,
                    "peopleNumber": 3,
                    "remerkDetail": "Rustic",
                    "serialNumber": 23
                },
                {
                    "id": 21,
                    "shiftDate": "2022-01-30T13:22:59.000Z",
                    "workCategory": "others",
                    "disposalFacilityId": null,
                    "address": "26897 結衣 Cliff",
                    "timeSpecificationMethod": "afterCall",
                    "timeSpecificationMethodOtherText": null,
                    "amOrPm": null,
                    "specifiedTime": null,
                    "arriveTime": null,
                    "peopleNumber": 4,
                    "remerkDetail": "International",
                    "serialNumber": 21
                },
                {
                    "id": 20,
                    "shiftDate": "2022-01-10T07:07:44.000Z",
                    "workCategory": "officeWork",
                    "disposalFacilityId": null,
                    "address": "860 太一 Gateway",
                    "timeSpecificationMethod": "fromTo",
                    "timeSpecificationMethodOtherText": null,
                    "amOrPm": null,
                    "specifiedTime": null,
                    "arriveTime": null,
                    "peopleNumber": 1,
                    "remerkDetail": "hacking",
                    "serialNumber": 20
                },
                {
                    "id": 18,
                    "shiftDate": "2022-01-28T23:14:32.000Z",
                    "workCategory": "officeWork",
                    "disposalFacilityId": null,
                    "address": "1685 海翔 Mountain",
                    "timeSpecificationMethod": "none",
                    "timeSpecificationMethodOtherText": null,
                    "amOrPm": null,
                    "specifiedTime": null,
                    "arriveTime": null,
                    "peopleNumber": 9,
                    "remerkDetail": "Solutions",
                    "serialNumber": 18
                },
                {
                    "id": 17,
                    "shiftDate": "2022-01-20T15:10:57.000Z",
                    "workCategory": "others",
                    "disposalFacilityId": null,
                    "address": "03647 加藤 Lakes",
                    "timeSpecificationMethod": "amPm",
                    "timeSpecificationMethodOtherText": null,
                    "amOrPm": "am",
                    "specifiedTime": null,
                    "arriveTime": null,
                    "peopleNumber": 8,
                    "remerkDetail": "tan",
                    "serialNumber": 17
                }
            ],
            "totalItems": 20
        },
        "code": 200
    });
}

async function getPeriodCollectionRecords(req, res) {
    res.json({
        "message": "success",
        "data": {
            "items": [
                {
                    "id": 1,
                    "courseName": "Corporate Response Officer",
                    "shiftDate": "2021-12-31T00:00:00.000Z",
                    "shiftCoursePics": [],
                    "inputTime": null,
                    "gpsTransitTime": null,
                    "address": null,
                    "collectWeek": [
                        "mon",
                        "tue",
                        "wed",
                        "fri"
                    ],
                    "numOfBag": null,
                    "collectedNumOfBag": -1,
                    "remark": null,
                    "paymentMethod": null,
                    "receiptFlg": null,
                    "totalAmount": null,
                    "manifest": null,
                    "paymentDate": null,
                    "receivedFee": null,
                    "check": null,
                    "paymentRemark": null,
                    "photos": [],
                    "collectionContents": []
                },
                {
                    "id": 2,
                    "courseName": "Investor Markets Administrator",
                    "shiftDate": "2021-12-31T00:00:00.000Z",
                    "shiftCoursePics": [],
                    "inputTime": null,
                    "gpsTransitTime": null,
                    "address": null,
                    "collectWeek": [
                        "wed",
                        "fri"
                    ],
                    "numOfBag": null,
                    "collectedNumOfBag": -1,
                    "remark": null,
                    "paymentMethod": null,
                    "receiptFlg": null,
                    "totalAmount": null,
                    "manifest": null,
                    "paymentDate": null,
                    "receivedFee": null,
                    "check": null,
                    "paymentRemark": null,
                    "photos": [],
                    "collectionContents": []
                },
                {
                    "id": 3,
                    "courseName": "Investor Web Consultant",
                    "shiftDate": "2021-12-31T00:00:00.000Z",
                    "shiftCoursePics": [],
                    "inputTime": null,
                    "gpsTransitTime": null,
                    "address": null,
                    "collectWeek": [
                        "mon",
                        "wed",
                        "fri",
                        "sat"
                    ],
                    "numOfBag": null,
                    "collectedNumOfBag": -1,
                    "remark": null,
                    "paymentMethod": null,
                    "receiptFlg": null,
                    "totalAmount": null,
                    "manifest": null,
                    "paymentDate": null,
                    "receivedFee": null,
                    "check": null,
                    "paymentRemark": null,
                    "photos": [],
                    "collectionContents": []
                },
                {
                    "id": 4,
                    "courseName": "Product Infrastructure Director",
                    "shiftDate": "2021-12-31T00:00:00.000Z",
                    "shiftCoursePics": [],
                    "inputTime": null,
                    "gpsTransitTime": null,
                    "address": null,
                    "collectWeek": [
                        "mon",
                        "tue",
                        "wed",
                        "fri",
                        "sat"
                    ],
                    "numOfBag": null,
                    "collectedNumOfBag": -1,
                    "remark": null,
                    "paymentMethod": null,
                    "receiptFlg": null,
                    "totalAmount": null,
                    "manifest": null,
                    "paymentDate": null,
                    "receivedFee": null,
                    "check": null,
                    "paymentRemark": null,
                    "photos": [],
                    "collectionContents": []
                },
                {
                    "id": 5,
                    "courseName": "Central Security Engineer",
                    "shiftDate": "2021-12-31T00:00:00.000Z",
                    "shiftCoursePics": [],
                    "inputTime": null,
                    "gpsTransitTime": null,
                    "address": null,
                    "collectWeek": [
                        "wed",
                        "thu",
                        "fri"
                    ],
                    "numOfBag": null,
                    "collectedNumOfBag": -1,
                    "remark": null,
                    "paymentMethod": null,
                    "receiptFlg": null,
                    "totalAmount": null,
                    "manifest": null,
                    "paymentDate": null,
                    "receivedFee": null,
                    "check": null,
                    "paymentRemark": null,
                    "photos": [],
                    "collectionContents": []
                },
                {
                    "id": 6,
                    "courseName": "Cory 小林",
                    "shiftDate": "2021-12-31T00:00:00.000Z",
                    "shiftCoursePics": [],
                    "inputTime": null,
                    "gpsTransitTime": null,
                    "address": null,
                    "collectWeek": [
                        "mon",
                        "fri",
                        "sat"
                    ],
                    "numOfBag": null,
                    "collectedNumOfBag": -1,
                    "remark": null,
                    "paymentMethod": null,
                    "receiptFlg": null,
                    "totalAmount": null,
                    "manifest": null,
                    "paymentDate": null,
                    "receivedFee": null,
                    "check": null,
                    "paymentRemark": null,
                    "photos": [],
                    "collectionContents": []
                },
                {
                    "id": 7,
                    "courseName": "Elizabeth 清水 DVM",
                    "shiftDate": "2021-12-31T00:00:00.000Z",
                    "shiftCoursePics": [],
                    "inputTime": null,
                    "gpsTransitTime": null,
                    "address": null,
                    "collectWeek": [
                        "wed",
                        "thu",
                        "fri",
                        "sat"
                    ],
                    "numOfBag": null,
                    "collectedNumOfBag": -1,
                    "remark": null,
                    "paymentMethod": null,
                    "receiptFlg": null,
                    "totalAmount": null,
                    "manifest": null,
                    "paymentDate": null,
                    "receivedFee": null,
                    "check": null,
                    "paymentRemark": null,
                    "photos": [],
                    "collectionContents": []
                },
                {
                    "id": 8,
                    "courseName": "National Group Consultant",
                    "shiftDate": "2021-12-30T00:00:00.000Z",
                    "shiftCoursePics": [],
                    "inputTime": null,
                    "gpsTransitTime": null,
                    "address": null,
                    "collectWeek": [
                        "thu",
                        "sat"
                    ],
                    "numOfBag": null,
                    "collectedNumOfBag": -1,
                    "remark": null,
                    "paymentMethod": null,
                    "receiptFlg": null,
                    "totalAmount": null,
                    "manifest": null,
                    "paymentDate": null,
                    "receivedFee": null,
                    "check": null,
                    "paymentRemark": null,
                    "photos": [],
                    "collectionContents": []
                },
                {
                    "id": 9,
                    "courseName": "Internal Factors Consultant",
                    "shiftDate": "2021-12-30T00:00:00.000Z",
                    "shiftCoursePics": [],
                    "inputTime": null,
                    "gpsTransitTime": null,
                    "address": null,
                    "collectWeek": [
                        "mon",
                        "thu",
                        "sat"
                    ],
                    "numOfBag": null,
                    "collectedNumOfBag": -1,
                    "remark": null,
                    "paymentMethod": null,
                    "receiptFlg": null,
                    "totalAmount": null,
                    "manifest": null,
                    "paymentDate": null,
                    "receivedFee": null,
                    "check": null,
                    "paymentRemark": null,
                    "photos": [],
                    "collectionContents": []
                },
                {
                    "id": 10,
                    "courseName": "Corporate Optimization Associate",
                    "shiftDate": "2021-12-30T00:00:00.000Z",
                    "shiftCoursePics": [],
                    "inputTime": null,
                    "gpsTransitTime": null,
                    "address": null,
                    "collectWeek": [
                        "thu"
                    ],
                    "numOfBag": null,
                    "collectedNumOfBag": -1,
                    "remark": null,
                    "paymentMethod": null,
                    "receiptFlg": null,
                    "totalAmount": null,
                    "manifest": null,
                    "paymentDate": null,
                    "receivedFee": null,
                    "check": null,
                    "paymentRemark": null,
                    "photos": [],
                    "collectionContents": []
                }
            ],
            "totalItems": 2306
        },
        "code": 200
    });
}

async function getPeriodCollectionDetail(req, res) {
    await sleep(1500);
    res.json(
        {
            "code": 200,
            "message": "string",
            "data": {
                "id": 1,
                "courseName": "string",
                "shiftDate": "2022-01-24T07:15:29.650Z",
                "shiftCoursePics": [
                    "string"
                ],
                "inputTime": "2022-01-24T07:15:29.650Z",
                "gpsTransitTime": "2022-01-24T07:15:29.650Z",
                "address": "string",
                "collectWeek": [
                    "sun",
                    "mon",
                    "tue",
                    "wed",
                    "thu",
                    "fri",
                    "sat"
                ],
                "numOfBag": 0,
                "collectedNumOfBag": 0,
                "remark": "string",
                "paymentMethod": "cash",
                "receiptFlg": "0",
                "totalAmount": 0,
                "manifest": "string",
                "paymentDate": "2022-01-24T07:15:29.650Z",
                "receivedFee": 0,
                "check": "string",
                "paymentRemark": "string",
                "customerOfficeName": [
                    "string"
                ],
                "isCautionInstructionExist": true,
                "isPhotoInstructionExist": true,
                "photos": [
                    {
                        "id": 0,
                        "fileName": "AAA.jpg",
                        "image": "https://picsum.photos/id/11/500/300",
                        "reason": "incombustible"
                    },
                    {
                        "id": 1,
                        "fileName": "BBB.jpg",
                        "image": "https://picsum.photos/id/11/500/300",
                        "reason": "incombustible"
                    }
                ],
                "collectionContents": [
                    {
                        "contentId": 0,
                        "standardFeeId": 0,
                        "disposerName": "string",
                        "item1": "normal",
                        "item1Fee": 1000,
                        "item1Num": 3,
                        "item1Unit": "m3",
                        "item2": "xxx",
                        "item2Fee": 2000,
                        "item2Num": 1,
                        "item2Unit": "stand",
                        "totalFee": 5000,
                        "weight": 30
                    }
                ]
            },
            "errors": {}
        }
    )
}

async function getUsers(req, res) {
    res.json({
        "code": 0,
        "message": "string",
        "data": {
            "totalItems": 3,
            "items": [
                {
                    "id": 0,
                    "loginId": "string",
                    "fullName": "string",
                    "shortName": "string",
                    "roles": [
                        "string"
                    ],
                    "driverFlg": "0",
                    "salesFlg": "0",
                    "displayOrder": 0,
                    "status": "waiting_for_approval",
                    "icon": "string",
                    "color": "string",
                    "remark": "string",
                    "groupId": 0,
                    "groupName": "string",
                    "lastLoginAt": "2022-01-17T13:08:46.299Z",
                    "createdAt": "2022-01-17T13:08:46.299Z",
                    "updatedAt": "2022-01-17T13:08:46.299Z",
                    "createdBy": 0,
                    "updatedBy": 0
                },
                {
                    "id": 1,
                    "loginId": "string",
                    "fullName": "string",
                    "shortName": "string",
                    "roles": [
                        "string"
                    ],
                    "driverFlg": "0",
                    "salesFlg": "0",
                    "displayOrder": 0,
                    "status": "waiting_for_approval",
                    "icon": "string",
                    "color": "string",
                    "remark": "string",
                    "groupId": 0,
                    "groupName": "string",
                    "lastLoginAt": "2022-01-17T13:08:46.299Z",
                    "createdAt": "2022-01-17T13:08:46.299Z",
                    "updatedAt": "2022-01-17T13:08:46.299Z",
                    "createdBy": 0,
                    "updatedBy": 0
                },
                {
                    "id": 2,
                    "loginId": "string",
                    "fullName": "string",
                    "shortName": "string",
                    "roles": [
                        "string"
                    ],
                    "driverFlg": "0",
                    "salesFlg": "0",
                    "displayOrder": 0,
                    "status": "active",
                    "icon": "string",
                    "color": "string",
                    "remark": "string",
                    "groupId": 0,
                    "groupName": "string",
                    "lastLoginAt": "2022-01-17T13:08:46.299Z",
                    "createdAt": "2022-01-17T13:08:46.299Z",
                    "updatedAt": "2022-01-17T13:08:46.299Z",
                    "createdBy": 0,
                    "updatedBy": 0
                }
            ]
        },
        "errors": {}
    });
}

async function getGroups(req, res) {
    res.json(
        {
            "message": "success",
            "data": {
                "items": [
                    {
                        "id": 1,
                        "name": "test_group1",
                        "backgroundColor": "#ffaaaa"
                    },
                    {
                        "id": 2,
                        "name": "test_group2",
                        "backgroundColor": "#aaffaa"
                    },
                    {
                        "id": 3,
                        "name": "test_group3",
                        "backgroundColor": "#aaaaff"
                    }
                ],
                "totalItems": 3
            },
            "code": 200
        }
    );
}

async function addGroup(req, res) {
    res.json({
        "code": 0,
        "message": "string",
        "data": {
            "id": 0
        },
        "errors": {}
    });
}

async function getGroupOne(req, res) {
    await sleep(2000);
    res.json({
        "code": 0,
        "message": "string",
        "data": {
            "id": 1,
            "name": "test_group1",
            "backgroundColor": "#ffaaaa"
        },
        "errors": {}
    });
}

async function getDisposals(req, res) {
    await sleep(1000);
    res.json({
        "message": "success",
        "data": {
            "items": [
                {
                    "id": 1,
                    "name": "高橋 - 木村",
                    "postalCode": "311-5730",
                    "address1": "鹿児島県Berwyn8036 蓮 Station",
                    "address2": "Apt. 545",
                    "tel": "00897719912",
                    "remark": "さきまわり しばふ たいりく.",
                    "createdAt": "2022-01-17T16:35:20.408Z",
                    "updatedAt": "2022-01-17T16:35:20.408Z",
                    "deletedAt": null,
                    "createdBy": null,
                    "updatedBy": null,
                    "deletedBy": null,
                    "disposerId": 5,
                    "disposerName": "山本 - 松本",
                    "gpss": []
                },
                {
                    "id": 2,
                    "name": "清水, 山本 and 田中",
                    "postalCode": "289-3660",
                    "address1": "熊本県Tustin4142 伊藤 Ranch",
                    "address2": "Apt. 265",
                    "tel": "00494074859",
                    "remark": "きょうはんしゃ たいこうする 床 くつじょく.",
                    "createdAt": "2022-01-17T16:35:20.417Z",
                    "updatedAt": "2022-01-17T16:35:20.417Z",
                    "deletedAt": null,
                    "createdBy": null,
                    "updatedBy": null,
                    "deletedBy": null,
                    "disposerId": 5,
                    "disposerName": "山本 - 松本",
                    "gpss": []
                },
                {
                    "id": 3,
                    "name": "高橋, 鈴木 and 田中",
                    "postalCode": "860-8646",
                    "address1": "高知県Redding92960 樹 Gardens",
                    "address2": "Suite 891",
                    "tel": "00636617804",
                    "remark": "けいけんしゃ 復旧 間隔 特殊 おととい フランス人 斬殺 雇用 せんじょうざい.",
                    "createdAt": "2022-01-17T16:35:20.425Z",
                    "updatedAt": "2022-01-17T16:35:20.425Z",
                    "deletedAt": null,
                    "createdBy": null,
                    "updatedBy": null,
                    "deletedBy": null,
                    "disposerId": 8,
                    "disposerName": "山本 - 清水",
                    "gpss": []
                },
                {
                    "id": 4,
                    "name": "山本 - 渡辺",
                    "postalCode": "314-6242",
                    "address1": "茨城県Ellicott City6044 太一 Springs",
                    "address2": "Suite 580",
                    "tel": "00467334824",
                    "remark": "賢明 かぜ 活用 れつあく ないしょばなし 好き.",
                    "createdAt": "2022-01-17T16:35:20.436Z",
                    "updatedAt": "2022-01-17T16:35:20.436Z",
                    "deletedAt": null,
                    "createdBy": null,
                    "updatedBy": null,
                    "deletedBy": null,
                    "disposerId": 4,
                    "disposerName": "田中, 高橋 and 山田",
                    "gpss": []
                },
                {
                    "id": 5,
                    "name": "佐々木 - 渡辺",
                    "postalCode": "858-2918",
                    "address1": "愛媛県Blacksburg56513 木村 Grove",
                    "address2": "Suite 540",
                    "tel": "00106210643",
                    "remark": "休日 ちがい かんそく うんがいい 縛る やしなう.",
                    "createdAt": "2022-01-17T16:35:20.440Z",
                    "updatedAt": "2022-01-17T16:35:20.440Z",
                    "deletedAt": null,
                    "createdBy": null,
                    "updatedBy": null,
                    "deletedBy": null,
                    "disposerId": 2,
                    "disposerName": "加藤 Inc",
                    "gpss": []
                },
                {
                    "id": 6,
                    "name": "斎藤, 中村 and 吉田",
                    "postalCode": "819-1296",
                    "address1": "岩手県Highlands Ranch9132 吉田 Estates",
                    "address2": "Suite 274",
                    "tel": "00042199149",
                    "remark": "金星 騎兵 復旧 にる すいせん りょうど けいむしょ えきびょう こうちょく 問題.",
                    "createdAt": "2022-01-17T16:35:20.445Z",
                    "updatedAt": "2022-01-17T16:35:20.445Z",
                    "deletedAt": null,
                    "createdBy": null,
                    "updatedBy": null,
                    "deletedBy": null,
                    "disposerId": 6,
                    "disposerName": "加藤, 田中 and 林",
                    "gpss": []
                },
                {
                    "id": 7,
                    "name": "山田 LLC",
                    "postalCode": "132-8974",
                    "address1": "福岡県McAllen8830 佐藤 Parkways",
                    "address2": "Suite 760",
                    "tel": "00847638930",
                    "remark": "傑作 きゅうりょう さいばん きんく れつあく 陳列室.",
                    "createdAt": "2022-01-17T16:35:20.449Z",
                    "updatedAt": "2022-01-17T16:35:20.449Z",
                    "deletedAt": null,
                    "createdBy": null,
                    "updatedBy": null,
                    "deletedBy": null,
                    "disposerId": 7,
                    "disposerName": "中村 Inc",
                    "gpss": []
                },
                {
                    "id": 8,
                    "name": "加藤, 山口 and 高橋",
                    "postalCode": "641-1633",
                    "address1": "石川県Athens-Clarke County980 莉子 Plain",
                    "address2": "Apt. 741",
                    "tel": "00383234023",
                    "remark": "かちゅう 色盲 かんじる 屈む 浮世絵 右翼 はんそう.",
                    "createdAt": "2022-01-17T16:35:20.453Z",
                    "updatedAt": "2022-01-17T16:35:20.453Z",
                    "deletedAt": null,
                    "createdBy": null,
                    "updatedBy": null,
                    "deletedBy": null,
                    "disposerId": 2,
                    "disposerName": "加藤 Inc",
                    "gpss": []
                },
                {
                    "id": 9,
                    "name": "井上 - 渡辺",
                    "postalCode": "813-2004",
                    "address1": "茨城県Lake Elsinore14233 蓮 Bypass",
                    "address2": "Suite 112",
                    "tel": "00061539148",
                    "remark": "ぼくし じぎする 希望する 右翼.",
                    "createdAt": "2022-01-17T16:35:20.460Z",
                    "updatedAt": "2022-01-17T16:35:20.460Z",
                    "deletedAt": null,
                    "createdBy": null,
                    "updatedBy": null,
                    "deletedBy": null,
                    "disposerId": 5,
                    "disposerName": "山本 - 松本",
                    "gpss": []
                },
                {
                    "id": 10,
                    "name": "鈴木 Inc",
                    "postalCode": "153-0193",
                    "address1": "大分県Victorville5296 翼 Dam",
                    "address2": "Apt. 778",
                    "tel": "00901879284",
                    "remark": "かぶしきしじょう 洋服 じぶん 手作り 機嫌 窒息 よくげつ ざぜん.",
                    "createdAt": "2022-01-17T16:35:20.465Z",
                    "updatedAt": "2022-01-17T16:35:20.465Z",
                    "deletedAt": null,
                    "createdBy": null,
                    "updatedBy": null,
                    "deletedBy": null,
                    "disposerId": 10,
                    "disposerName": "松本, 渡辺 and 松本",
                    "gpss": []
                },
                {
                    "id": 11,
                    "name": "林 - 田中",
                    "postalCode": "353-6140",
                    "address1": "長崎県Sanford0455 結衣 Motorway",
                    "address2": "Suite 767",
                    "tel": "00510264404",
                    "remark": "没落 つまる ひんかく ふん.",
                    "createdAt": "2022-01-17T16:35:20.470Z",
                    "updatedAt": "2022-01-17T16:35:20.470Z",
                    "deletedAt": null,
                    "createdBy": null,
                    "updatedBy": null,
                    "deletedBy": null,
                    "disposerId": 11,
                    "disposerName": "山口 Group",
                    "gpss": []
                }
            ],
            "totalItems": 11
        },
        "code": 200
    });
}

async function getPeriodCollectionContent(req, res) {
    await sleep(1000);
    res.json({
        "code": 200,
        "message": "string",
        "data":{
            "totalItems": 2,
            "items": [
                {
                    "id": 0,
                    "contractItemName": "string",
                    "disposerId": 0,
                    "disposerName": "string",
                    "itemName": "string",
                    "standardFee": 0,
                    "itemNumber": 0,
                    "standardFeeUnit": "string",
                    "standardCollectTransportFee": 0,
                    "standardCollectTransportNumber": 0,
                    "standardCollectTransportFeeUnit": "squareMeterKg",
                    "weight": 0
                },
                {
                    "id": 1,
                    "contractItemName": "string",
                    "disposerId": 0,
                    "disposerName": "string",
                    "itemName": "string",
                    "standardFee": 0,
                    "itemNumber": 0,
                    "standardFeeUnit": "string",
                    "standardCollectTransportFee": 0,
                    "standardCollectTransportNumber": 0,
                    "standardCollectTransportFeeUnit": "squareMeterKg",
                    "weight": 0
                }
            ]
        },
        "errors": {}
    });
}

async function removePeriodCollectionContent(req, res){
    await sleep(1000);
    res.json({
        "code": 200,
        "message": "string",
        "data": {
            "id": 0
        },
        "errors": {}
    });
}

async function collectionPhotoReasonPatch(req, res) {
    await sleep(1000);
    res.json({
        "code": 200,
        "message": "string",
        "data": {
            "id": 0
        },
        "errors": {}
    });
}

async function collectionPhotoRemove(req, res){
    await sleep(1000);
    res.json({
        "code": 200,
        "message": "string",
        "data": {
            "id": 0
        },
        "errors": {}
    });
}

async function collectionPatch(req, res) {
    await sleep(1000);
    res.json({
        "code": 200,
        "message": "string",
        "data": {
            "id": 0
        },
        "errors": {}
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    serverStatus,
    dailyWorks,
    getPeriodCollectionRecords,
    getUsers,
    getGroups,
    addGroup,
    getGroupOne,
    getDisposals,
    getPeriodCollectionDetail,
    getPeriodCollectionContent,
    removePeriodCollectionContent,
    collectionPhotoReasonPatch,
    collectionPhotoRemove,
    collectionPatch,
};
