import { Router } from 'express';

import {
    createJob,
    getJob,
    getJobs,
    deleteJob,
    updateJob,
} from '../controllers/jobController.js'

// middleware
import { requireAuth } from '../middleware/requireAuth.js';
import { uploadAttachments } from '../middleware/uploadAttachments.js';

import Job from '../models/job.js';

import Contact from '../models/contact.js'

const router = Router();

router.get('/seed', async (req, res, next) => {
    const newContacts = { message: "not in use" };
    // const newContacts = seed();
    // await Contact.insertMany(newContacts);

    // const jobs = await Job.find({});

    // jobs.forEach(async (doc) => {
    //     if (!doc.mileage) {
    //         doc.mileage = 0;
    //         await doc.save();
    //     }
    // })

    return res.status(200).json(newContacts);
});

// authenticates user is valid and logged in to access further end points
router.use(requireAuth);

// GET jobs
router.get('/', getJobs);

// GET a single job
router.get('/:id', getJob);

// POST a new job
router.post('/', uploadAttachments, createJob);

// DELETE a job
router.delete('/:id', deleteJob);

// UPDATE a job
router.patch('/:id', uploadAttachments, updateJob);

export default router;

function seed() {
    const email = `Moving Forward Office
    Moving Forward Office
    1714 1st Street NE
    Auburn, WA 98002
     
    SN Renton Office
    Smith + Nephew
    2210 Lind Ave. SW
    Suite 102
    Renton, WA 98057
     
    Fred Hutchinson
    Fred Hutchinson
    1100 Fairview Ave. N.
    Seattle, WA 98109
     
    Seattle Childrens – 9th
    Seattle Childrens Hospital
    1900 9th Avenue
    Seattle, WA 98101
     
    Seattle Childrens – Sand
    Seattle Childrens Hospital
    4800 Sand Point WAY NE
    Seattle, WA 98105
     
    TireRack
    TireRack
    1021 S. 146th Street
    Burien, WA 98168
     
    Everett Clinic – Shoreline
    The Everett Clinic
    1201 N. 175th Street
    Laboratory
    Shoreline, WA 98133
     
    Everett Clinic – Gunderson Building
    The Everett Clinic
    3927 Rucker Avenue
    ENT Department
    Everett, WA 98201
     
    Everett Clinic – Arlington
    The Everett Clinic
    4011 172nd Street NE
    ENT Department
    Arlington, WA 98223
     
    UW – Pacific
    UW Medical Center
    195 NE Pacific Street
    Seattle, WA 9819
     
    UW – Foege
    UW Foege Dock
    3720 15th Ave. NE
    Seattle, WA 98195
     
    UW – Republican
    University of Washington
    750 Republican Street
    Seattle, WA 98109
     
    SEA Stryker
    Stryker Kent Office
    20526 59th Place S.
    Kent, WA 98032
     
    Orion
    Orion
    1590 A Street NE
    Auburn, WA 98002
     
    Bollore
    Bollore SEA
    18800 8th Ave. S.
    SeaTac, WA 98148
     
    Pacific Coast Composites
    Pacific Coast Composites
    418 Valley Ave. NW
    Puyallup, WA 98371
     
    American Expediting
    American Expediting
    1091 Industry Drive
    Tukwila, WA 98188
     
    SEA American Cargo
    American Airlines Cargo
    2427 S. 161st Street
    Seattle, WA 98158
     
    SEA Delta Cargo
    Delta Air Cargo
    18627 28th Ave. S.
    SeaTac, WA 98158
     
    SEA Southwest Cargo
    Southwest Air Cargo
    16215 Air Cargo Road
    SeaTac, WA 98158
     
    SEA United Cargo
    United Air Cargo
    16745 Air Cargo Road
    SeaTac, WA 98158
     
    SEA Singapore Cargo
    Singapore Air Cargo
    16745 Air Cargo Road
    SeaTac, WA 98158
     
    SEA Virgin Cargo
    Virgin Air Cargo
    18627 28th Ave. S.
    SeaTac, WA 98158
     
    SEA Air France Cargo
    Air France Cargo
    18627 28th Avenue South
    SeaTac, WA 98158
     
    SEA Aer Lingus Cargo
    Aer Lingus Cargo
    2427 S. 161st Street
    SeaTac, WA 98158
     
    SEA Emirates Cargo
    Emirates Air Cargo
    2427 S. 161st Street
    SeaTac, WA 98158
     
    SEA British Cargo
    British Air Cargo
    2427 S. 161st Street
    SeaTac, WA 98158
     
    SEA Eva Cargo
    Eva Air Cargo
    2427 S. 161st Street
    SeaTac, WA 98158
     
    SEA Alaska Cargo
    Alaska Air Cargo
    2600 S. 165th Street
    SeaTac, WA 98158
     
    SEA Turkish Cargo
    Turkish Air Cargo
    2427 S. 161st Street
    SeaTac, WA 98158
     
    SEA Qatar Cargo
    Qatar Air Cargo
    2427 S. 161st Street
    SeaTac, WA 98158
     
    SEA Iceland Cargo
    Iceland Air Cargo
    2427 S. 161st Street
    SeaTac, WA 98158
     
    SEA Korean Cargo
    Korean Air Cargo
    2580 S. 156th Street
    Bldg. A
    Seattle, WA 98158
     
    SEA Lufthansa Cargo
    Lufthansa Air Cargo
    2580 S. 156th Street
    Bldg. A
    Seattle, WA 98158
     
    SpaceX
    SpaceX
    22982 NE Marketplace Drive
    Redmond, WA 98053
     
    SEA Atlas
    Atlas Air – Seattle
    16215 Air Cargo Road
    Room 2F
    SeaTac, WA 98158
     
    Boeing AOG Tooling
    The Boeing Company
    Boeing C/O AOG Tooling
    7701 14th Ave. S.
    Seattle, WA 98108
     
    Boeing SeaTac 22-01
    The Boeing Company
    2201 South 142nd Street
    Bldg. 22-01
    Seattle, WA 98168
     
    Boeing Auburn 17-66
    The Boeing Company
    700 15th Street SW
    BLDG 17-66
    Auburn, WA 98001
     
    Boeing Renton 737
    The Boeing Company
    737 Logan Ave. N.
    Bldg. 4-75
    Renton, WA 98055
     
    Boeing Everett 7-36
    The Boeing Company
    6001 36th Ave W.
    BLDG 7-36
    Everett, WA 98203
     
    Boeing Everett 40-05
    The Boeing Company
    3003 W. Casino Road
    Bldg. 40-05
    Everett, WA 98204
     
    Good To Go
    Good To Go
    707 S. Grady Way
    Renton, WA 98057
     
    USPS Renton
    United States Postal Service
    4301 NE 4th Street
    Renton, WA 98059
     
    Providence Everett
    Providence Everett
    1700 13th Street
    Everett, WA 98201
     
    Whidbey Hospital
    Whidbey Hospital
    101 N Main Street
    Coupeville, WA 98239
     
    St. Anthonys
    St. Anthony Hospital
    11567 Canterwood Blvd NW
    Gig Harbor, WA 98332
     
    Overlake
    Overlake Medical Center
    1035 116th Ave. NE
    Bellevue, WA 98004
     
    Evergreen
    Evergreen Health Medical Center
    12040 NE 128th St.
    Kirkland, WA 98034
     
    Swedish Issaquah
    Swedish Issaquah Campus
    751 NE Blakely Drive
    Issaquah, WA 98029
     
    Providence Issaquah
    Providence Issaquah
    3725 Providence Point Dr SE
    Issaquah, WA 98029
     
    OMC
    Olympic Medical Center
    939 Caroline St
    Port Angeles, WA 98362
     
    Skagit Valley
    Skagit Valley Hospital
    300 Hospital Parkway
    Mount Vernon, WA 98274
     
    St. Annes
    St. Annes Hospital
    16251 Sylvester Rd SW
    Burien, WA 98166
     
    St. Michaels
    St. Michaels Medical Center
    1800 NW Myhre Rd
    Silverdale, WA 98383
     
    St. Josephs
    St. Josephs Hospital
    2901 Squalicum Pkwy
    Bellingham, WA 98228
     
    St. Peters
    St. Peters Hospital
    413 Lilly Road NE
    Olympia, WA 98506
     
    Island
    Island Hospital
    1211 24th St
    Anacortes, WA 98221
     
    Jefferson
    Jefferson General Hospital
    834 Sheridan Street
    Port Townsend, WA 98368
     
    Swedish Edmonds
    Swedish Edmonds
    21601 76th Ave. W.
    Edmonds, WA 98026
     
    Everett Clinic
    Everett Clinic
    3927 Rucker Ave.
    Everett, WA 98201
     
    Proliance Spine
    Proliance Spine
    6808 220th Street
    Suite 100
    Mountlake Terrace, WA 98043
     
    Cascade Hospital
    Cascade Hospital
    330 S Stillaguamish Ave.
    Arlington, WA 98223
     
    Everett Bone and Joint
    Everett Bone and Joint
    1100 Pacific Ave.
    Suite 300
    Everett, WA 98201
     
    Yokohama Aerospace
    Yokohama Aerospace
    22223 68th Ave. S.
    Kent, WA 98032
     
    Vas Aero
    Vas Aero Services, LLC
    18202 80th Ave. S.
    Kent, WA 98032
     
    PDX Brownstone
    PDX Brownstone
    4775 NE 185th Drive
    Portland, OR 97230
     
    ASML
    ASML US LLC
    5615 NE Huffman Street
    Hillsboro, OR 97124
     
    Microchip
    Microchip
    21015 SE Stark St
    Gresham Or 97030
     
    Tokyo – Aloclek
    Tokyo Electronics
    3188 Aloclek Drive
    Hillsboro, OR 97124
     
    Tokyo – Century
    Tokyo Electronics
    2501 NE Century Blvd.
    Hillsboro, OR 97124
     
    Intel
    Intel Corporation
    2501 NE Century Blvd.
    Hillsboro, OR 97124
     
    PDX Stryker
    Stryker Portland Office
    28050 Southwest Boberg Road
    Wilsonville, OR 97070
     
    PDX Atlas
    Atlas Air – Portland
    7425 Air Trans Way
    Portland Or 97218
     
    SN Beaverton Office
    Smith + Nephew
    5465 SW Western Ave.
    Beaverton, OR 97005
     
    PDX American Cargo
    Delta Air Cargo
    7908 NE Air Cargo Road
    Portland, OR 97218
     
    PDX Delta Cargo
    Delta Air Cargo
    7912 NE Air Cargo Road
    Portland, OR 97218
     
    PDX Southwest Cargo
    Southwest Air Cargo
    7808 NE Air Cargo Road
    Portland, OR 97218
     
    PDX United Cargo
    United Air Cargo
    8116 NE Air Cargo Road
    Portland, OR 97218
     
    PDX Alaska Cargo
    Alaska Air Cargo
    7904 NE Air Cargo Rd
    Portland, OR 97218
     
    PDX Korean Cargo
    Korean Air Cargo
    15613 NE Airport Way
    Portland, OR 97230
     
    Sky Lakes Medical Center
    Sky Lakes Medical Center
    2865 Daggett Ave.
    Klamath Falls, OR 97601
     
    Collins Aerospace
    Collins Aerospace
    27300 SW Parkway Ave.
    Building 594
    Wilsonville, OR 97070
     
    St. Johns
    Peace Health St. Johns
    1615 Deleware Street
    Longview, WA 98632
     
    Salmon Creek
    Legacy Salmon Creek
    2211 NE 139th Street
    Vancouver, WA 98686
     
    Hood River
    Providence Hood River
    810 12th Street
    Hood River, OR 97031
     
    PeaceHealth SW
    Peace Health SW Hospital
    400 NE Mother Joseph Place
    Vancouver, WA 98664
     
    Rebound
    Rebound Ortho & Neurosurgery
    200 NE Mother Joseph Place
    Vancouver, WA 98664
     
    Columbia River
    Columbia River Surgery Center
    9830 NE Cascades Pkwy
    Portland, OR 97220
     
    Interstate Kaiser
    Interstate Kaiser
    3550 N. Interstate Ave.
    Portland, OR 97227
     
    Emanual
    Legacy Emanuel Medical Center
    501 N. Graham Street
    Portland, OR 97227
     
    Mt. Hood
    Legacy Mt. Hood Medical Center
    24850 SE Stark Street
    Gresham, OR 97030
     
    PPMC
    Providence Portland Medical Center
    4805 NE Glisan Street
    Portland, OR 97213
     
    Plaza
    Multnomah Orthopedic
    5050 NE Hoyt Street
    Portland, OR 97213
     
    Tuality
    Hillsboro Medical Center
    335 SE 8th Avenue
    Hillsboro, OR 97123
     
    Good Samaritan Portland
    Legacy Good Samaritan Medical Center
    1015 NW 22nd Avenue
    Portland, OR 97210
     
    Adventist Portland
    Radiation Oncology Department
    10123 SE Market Street
    Portland, OR 97216
     
    Kaiser West
    Kaiser Permanente West
    2875 NE Stucki Ave.
    Hillsboro, OR 97124
     
    Specialty Surgery
    Center for Specialty Surgery
    11782 SW Barnes Road
    #200
    Portland, OR 97225
     
    St. Vincent
    Providence St. Vincent
    9205 SW Barnes Road
    Portland, OR 97228
     
    Shriners
    Shriner’s Hospital
    3101 SW Sam Jackson Park Rd.
    Portland, OR 97239
     
    SOR
    OHSU SOR
    3181 SW Sam Jackson Park Rd.
    Portland, OR 97239
     
    CHH2
    OHSU CHH2
    3303 S. Bond Ave.
    Portland, OR 97239
     
    Mt. Scott
    Mt. Scott Surgery Center
    9300 SE 91st  Ave.
    Happy Valley, OR 97086
     
    Mid-Columbia
    Mid-Columbia Medical Center
    1700 E 19th St
    The Dalles, OR 97058
     
    Milwaukie
    Providence Milwaukie Hospital
    10150 SE 32nd Ave.
    Milwaukie, OR 97222
     
    Alberty
    Alberty Surgical Center
    9100 SW Oleson Road
    Tigard, OR 97223
     
    SIP
    Kaiser Supply Center
    10200 SE Sunnyside Road
    Clackamas, OR 97015
     
    OSI
    Oregon Surgical Institute
    9405 SW Nimbus Ave.
    Beaverton, OR 97008
     
    Oregon Outpatient
    Oregon Outpatient
    7300 SW Childs Road
    Tigard, OR 97224
     
    Meridian
    Legacy Meridian Park Medical Center
    19300 SW 65th Ave.
    Tualatin, OR 97062
     
    Willy Falls
    Providence Willamette Falls Medical Center
    1508 Division Street
    Suite 105
    Oregon City, OR 97045
     
    Adventist Health Tillamook
    Adventist Health Tillamook
    1000 3rd Street
    Tillamook, OR 97141
     
    Willamette Surgery Center
    Willamette Surgery Center
    1445 State Street
    Salem, OR 97301
     
    Santiam
    Santiam Hospital
    1401 N 10th Ave
    Stayton, OR 97383
     
    Albany
    Samaritan Albany General
    1046 6th Ave. SW
    Albany, OR 97321
     
    Corvalis Good Samaritan
    Good Samaritan Corvalis
    3600 NW Samaritan Drive
    Corvalis, OR 97330
     
    Sacred Heart Springfield
    PeaceHealth Sacred Heart
    3333 Riverbend Drive
    Springfield, OR 97477
     
    McKenzie
    McKenzie-Willamette Medical Center
    1460 G Street
    Springfield, OR 97477
     
    St. Charles
    St. Charles
    2500 NE Neff Road
    Bend, OR 97701
     
    Doernbecher
    OHSU Doernbecher Children's Hospital
    700 SW Campus Drive
    Portland, OR 97239
     
    Cascade Surgicenter
    Cascade Surgicenter
    2200 NE Neff Road
    Bend, OR 97701
     
    Rogue
    Asante Rogue Regional Medical Center
    2825 E. Barnett Road
    Medford, OR 97504
     
    Ashland
    Asante Ashland Community
    280 Maple Street
    Ashland, OR 97520
     
    Coquille
    Coquille Valley Hospital
    940 E 5th Street
    Coquille, OR 97423
     
    Umpqua
    Lower Umpqua Hospital
    600 Ranch Road
    Reedsport, OR 97467
     
    Legacy Silverton
    Legacy Silverton Hospital
    342 Fairview Street
    Silverton, OR 97381
     
    Newberg
    Providence Newberg Medical Center
    1001 Providence Drive
    Newberg, OR 97132
     
    Salem Hospital
    Salem Hospital
    665 Winter Street SE
    Salem, OR 97301
     
    Providence Seaside
    Providence Seaside
    725 S Wahanna Road
    Seaside, OR 97138
     
    Sacred Heart Eugene
    Sacred Heart Eugene
    1225 Hilyard Street
    Eugene, OR 97401
     
    SN Spokane Office
    Smith + Nephew
    12409 E. Mirabeau Pkwy
    Spokane Valley, WA 99216
     
    Steven Cooley
    Steven Cooley
    1162 Viewmoor Ct.
    Richland, WA 99352
     
    Wade Cooley
    Wade Cooley
    5 E. 39th Ave.
    Spokane, WA 99203
     
    Pend Oriolle
    Pend Oriolle Surgery Center
    30544 Highway 200
    Ponderay, ID 83852
     
    Brad Hovde
    Brad Hovde
    728 S Ivery St
    Spokane WA 99202
     
    Bonner General
    Bonner General Hospital
    520 N. 3rd Ave.
    Sandpoint, ID 83864
     
    T-Mobile
    T-Mobile
    4405 Grant Road
    Bldg A
    East Wenatchee, WA 98802
     
    NCR
    NCR
    3200 E. Trent Ave.
    Suite E
    Spokane, WA 98202
     
    Sabey Smartbox
    HPE0310 Smartbox at Sabey
    4405 Grant Road
    Bldg B
    East Wenatchee, WA 98802
     
    Micron Technologies
    Micron Technologies, Inc.
    8000 S. Federal Way
    Boise, ID 83716
     
    GEG Alaska Cargo
    Alaska Air Cargo
    2933 Flint Road
    Spokane, WA 99224`;

    const array = email.split(/\r?\n/);

    const data = [];
    // array.forEach((x) => {
    //     const organization = array[0];
    //     let address = '';

    //     let i = 2;

    //     while (array[i] !== ' ') {
    //         if (!array[i] || array[i] === ' ') break;

    //         address += (array[i] + ' ');
    //         i++;
    //     };

    //     address = address.trim();

    //     // console.log("org:",organization)
    //     // console.log('address:', address);
    //     // console.log('')

    //     data.push({
    //         organization,
    //         address,
    //         createdBy: '642dc4801bc3cc6366f0eb7b'
    //     });

    //     array.splice(0, i + 1);
    // })
    const jsonTest = [{ "organization": "Moving Forward Office", "address": "1714 1st Street NE Auburn, WA 98002", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "SN Renton Office", "address": "2210 Lind Ave. SW Suite 102 Renton, WA 98057", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Fred Hutchinson", "address": "1100 Fairview Ave. N. Seattle, WA 98109", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Seattle Childrens – 9th", "address": "1900 9th Avenue Seattle, WA 98101", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Seattle Childrens – Sand", "address": "4800 Sand Point WAY NE Seattle, WA 98105", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "TireRack", "address": "1021 S. 146th Street Burien, WA 98168", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Everett Clinic – Shoreline", "address": "1201 N. 175th Street Laboratory Shoreline, WA 98133", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Everett Clinic – Gunderson Building", "address": "3927 Rucker Avenue ENT Department Everett, WA 98201", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Everett Clinic – Arlington", "address": "4011 172nd Street NE ENT Department Arlington, WA 98223", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "UW – Pacific", "address": "195 NE Pacific Street Seattle, WA 9819", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "UW – Foege", "address": "3720 15th Ave. NE Seattle, WA 98195", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "UW – Republican", "address": "750 Republican Street Seattle, WA 98109", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "SEA Stryker", "address": "20526 59th Place S. Kent, WA 98032", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Orion", "address": "1590 A Street NE Auburn, WA 98002", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Bollore", "address": "18800 8th Ave. S. SeaTac, WA 98148", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Pacific Coast Composites", "address": "418 Valley Ave. NW Puyallup, WA 98371", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "American Expediting", "address": "1091 Industry Drive Tukwila, WA 98188", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "SEA American Cargo", "address": "2427 S. 161st Street Seattle, WA 98158", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "SEA Delta Cargo", "address": "18627 28th Ave. S. SeaTac, WA 98158", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "SEA Southwest Cargo", "address": "16215 Air Cargo Road SeaTac, WA 98158", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "SEA United Cargo", "address": "16745 Air Cargo Road SeaTac, WA 98158", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "SEA Singapore Cargo", "address": "16745 Air Cargo Road SeaTac, WA 98158", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "SEA Virgin Cargo", "address": "18627 28th Ave. S. SeaTac, WA 98158", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "SEA Air France Cargo", "address": "18627 28th Avenue South SeaTac, WA 98158", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "SEA Aer Lingus Cargo", "address": "2427 S. 161st Street SeaTac, WA 98158", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "SEA Emirates Cargo", "address": "2427 S. 161st Street SeaTac, WA 98158", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "SEA British Cargo", "address": "2427 S. 161st Street SeaTac, WA 98158", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "SEA Eva Cargo", "address": "2427 S. 161st Street SeaTac, WA 98158", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "SEA Alaska Cargo", "address": "2600 S. 165th Street SeaTac, WA 98158", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "SEA Turkish Cargo", "address": "2427 S. 161st Street SeaTac, WA 98158", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "SEA Qatar Cargo", "address": "2427 S. 161st Street SeaTac, WA 98158", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "SEA Iceland Cargo", "address": "2427 S. 161st Street SeaTac, WA 98158", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "SEA Korean Cargo", "address": "2580 S. 156th Street Bldg. A Seattle, WA 98158", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "SEA Lufthansa Cargo", "address": "2580 S. 156th Street Bldg. A Seattle, WA 98158", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "SpaceX", "address": "22982 NE Marketplace Drive Redmond, WA 98053", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "SEA Atlas", "address": "16215 Air Cargo Road Room 2F SeaTac, WA 98158", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Boeing AOG Tooling", "address": "Boeing C/O AOG Tooling 7701 14th Ave. S. Seattle, WA 98108", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Boeing SeaTac 22-01", "address": "2201 South 142nd Street Bldg. 22-01 Seattle, WA 98168", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Boeing Auburn 17-66", "address": "700 15th Street SW BLDG 17-66 Auburn, WA 98001", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Boeing Renton 737", "address": "737 Logan Ave. N. Bldg. 4-75 Renton, WA 98055", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Boeing Everett 7-36", "address": "6001 36th Ave W. BLDG 7-36 Everett, WA 98203", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Boeing Everett 40-05", "address": "3003 W. Casino Road Bldg. 40-05 Everett, WA 98204", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Good To Go", "address": "707 S. Grady Way Renton, WA 98057", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "USPS Renton", "address": "4301 NE 4th Street Renton, WA 98059", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Providence Everett", "address": "1700 13th Street Everett, WA 98201", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Whidbey Hospital", "address": "101 N Main Street Coupeville, WA 98239", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "St. Anthonys", "address": "11567 Canterwood Blvd NW Gig Harbor, WA 98332", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Overlake", "address": "1035 116th Ave. NE Bellevue, WA 98004", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Evergreen", "address": "12040 NE 128th St. Kirkland, WA 98034", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Swedish Issaquah", "address": "751 NE Blakely Drive Issaquah, WA 98029", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Providence Issaquah", "address": "3725 Providence Point Dr SE Issaquah, WA 98029", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "OMC", "address": "939 Caroline St Port Angeles, WA 98362", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Skagit Valley", "address": "300 Hospital Parkway Mount Vernon, WA 98274", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "St. Annes", "address": "16251 Sylvester Rd SW Burien, WA 98166", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "St. Michaels", "address": "1800 NW Myhre Rd Silverdale, WA 98383", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "St. Josephs", "address": "2901 Squalicum Pkwy Bellingham, WA 98228", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "St. Peters", "address": "413 Lilly Road NE Olympia, WA 98506", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Island", "address": "1211 24th St Anacortes, WA 98221", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Jefferson", "address": "834 Sheridan Street Port Townsend, WA 98368", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Swedish Edmonds", "address": "21601 76th Ave. W. Edmonds, WA 98026", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Everett Clinic", "address": "3927 Rucker Ave. Everett, WA 98201", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Proliance Spine", "address": "6808 220th Street Suite 100 Mountlake Terrace, WA 98043", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Cascade Hospital", "address": "330 S Stillaguamish Ave. Arlington, WA 98223", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Everett Bone and Joint", "address": "1100 Pacific Ave. Suite 300 Everett, WA 98201", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Yokohama Aerospace", "address": "22223 68th Ave. S. Kent, WA 98032", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Vas Aero", "address": "18202 80th Ave. S. Kent, WA 98032", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "PDX Brownstone", "address": "4775 NE 185th Drive Portland, OR 97230", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "ASML", "address": "5615 NE Huffman Street Hillsboro, OR 97124", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Microchip", "address": "21015 SE Stark St Gresham Or 97030", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Tokyo – Aloclek", "address": "3188 Aloclek Drive Hillsboro, OR 97124", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Tokyo – Century", "address": "2501 NE Century Blvd. Hillsboro, OR 97124", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Intel", "address": "2501 NE Century Blvd. Hillsboro, OR 97124", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "PDX Stryker", "address": "28050 Southwest Boberg Road Wilsonville, OR 97070", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "PDX Atlas", "address": "7425 Air Trans Way Portland Or 97218", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "SN Beaverton Office", "address": "5465 SW Western Ave. Beaverton, OR 97005", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "PDX American Cargo", "address": "7908 NE Air Cargo Road Portland, OR 97218", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "PDX Delta Cargo", "address": "7912 NE Air Cargo Road Portland, OR 97218", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "PDX Southwest Cargo", "address": "7808 NE Air Cargo Road Portland, OR 97218", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "PDX United Cargo", "address": "8116 NE Air Cargo Road Portland, OR 97218", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "PDX Alaska Cargo", "address": "7904 NE Air Cargo Rd Portland, OR 97218", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "PDX Korean Cargo", "address": "15613 NE Airport Way Portland, OR 97230", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Sky Lakes Medical Center", "address": "2865 Daggett Ave. Klamath Falls, OR 97601", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Collins Aerospace", "address": "27300 SW Parkway Ave. Building 594 Wilsonville, OR 97070", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "St. Johns", "address": "1615 Deleware Street Longview, WA 98632", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Salmon Creek", "address": "2211 NE 139th Street Vancouver, WA 98686", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Hood River", "address": "810 12th Street Hood River, OR 97031", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "PeaceHealth SW", "address": "400 NE Mother Joseph Place Vancouver, WA 98664", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Rebound", "address": "200 NE Mother Joseph Place Vancouver, WA 98664", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Columbia River", "address": "9830 NE Cascades Pkwy Portland, OR 97220", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Interstate Kaiser", "address": "3550 N. Interstate Ave. Portland, OR 97227", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Emanual", "address": "501 N. Graham Street Portland, OR 97227", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Mt. Hood", "address": "24850 SE Stark Street Gresham, OR 97030", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "PPMC", "address": "4805 NE Glisan Street Portland, OR 97213", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Plaza", "address": "5050 NE Hoyt Street Portland, OR 97213", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Tuality", "address": "335 SE 8th Avenue Hillsboro, OR 97123", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Good Samaritan Portland", "address": "1015 NW 22nd Avenue Portland, OR 97210", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Adventist Portland", "address": "10123 SE Market Street Portland, OR 97216", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Kaiser West", "address": "2875 NE Stucki Ave. Hillsboro, OR 97124", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Specialty Surgery", "address": "11782 SW Barnes Road #200 Portland, OR 97225", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "St. Vincent", "address": "9205 SW Barnes Road Portland, OR 97228", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Shriners", "address": "3101 SW Sam Jackson Park Rd. Portland, OR 97239", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "SOR", "address": "3181 SW Sam Jackson Park Rd. Portland, OR 97239", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "CHH2", "address": "3303 S. Bond Ave. Portland, OR 97239", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Mt. Scott", "address": "9300 SE 91st  Ave. Happy Valley, OR 97086", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Mid-Columbia", "address": "1700 E 19th St The Dalles, OR 97058", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Milwaukie", "address": "10150 SE 32nd Ave. Milwaukie, OR 97222", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Alberty", "address": "9100 SW Oleson Road Tigard, OR 97223", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "SIP", "address": "10200 SE Sunnyside Road Clackamas, OR 97015", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "OSI", "address": "9405 SW Nimbus Ave. Beaverton, OR 97008", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Oregon Outpatient", "address": "7300 SW Childs Road Tigard, OR 97224", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Meridian", "address": "19300 SW 65th Ave. Tualatin, OR 97062", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Willy Falls", "address": "1508 Division Street Suite 105 Oregon City, OR 97045", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Adventist Health Tillamook", "address": "1000 3rd Street Tillamook, OR 97141", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Willamette Surgery Center", "address": "1445 State Street Salem, OR 97301", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Santiam", "address": "1401 N 10th Ave Stayton, OR 97383", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Albany", "address": "1046 6th Ave. SW Albany, OR 97321", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Corvalis Good Samaritan", "address": "3600 NW Samaritan Drive Corvalis, OR 97330", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "Sacred Heart Springfield", "address": "3333 Riverbend Drive Springfield, OR 97477", "createdBy": "642dc4801bc3cc6366f0eb7b" }, { "organization": "McKenzie", "address": "1460 G Street Springfield, OR 97477", "createdBy": "642dc4801bc3cc6366f0eb7b" }]


    return jsonTest;
}