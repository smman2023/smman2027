//==================================================
// أكاديمية السمان
// script.js
//==================================================


//=========================================
// Google Apps Script API
//=========================================

const API =
"https://script.google.com/macros/s/AKfycbzCRNT8QcNDe0SlcXSzO6n_aX6NOqoR6gaETolvGYzdRLes7QEUR6K4ZKrLpPch3HjT/exec";


//=========================================
// Variables
//=========================================

let currentStudent = null;

let videos = [];

let currentIndex = 0;


//=========================================
// Elements
//=========================================

const codeInput =
document.getElementById("codeInput");


const passwordInput =
document.getElementById("passwordInput");


const loginBtn =
document.getElementById("loginBtn");


const loginError =
document.getElementById("loginError");


const studentCard =
document.getElementById("studentCard");


const videosCard =
document.getElementById("videosCard");


const playerCard =
document.getElementById("playerCard");


const videosContainer =
document.getElementById("videosContainer");


const studentName =
document.getElementById("studentName");


const studentGrade =
document.getElementById("studentGrade");


const videoFrame =
document.getElementById("videoFrame");


const videoTitle =
document.getElementById("videoTitle");


const prevBtn =
document.getElementById("prevBtn");


const nextBtn =
document.getElementById("nextBtn");


const backBtn =
document.getElementById("backBtn");


const logoutBtn =
document.getElementById("logoutBtn");



//=========================================
// Login Event
//=========================================

loginBtn.onclick = function(){

    login();

};



//=========================================
// Login Function
//=========================================

async function login(){


    const code =
    codeInput.value.trim();


    const password =
    passwordInput.value.trim();



    if(code === "" || password === ""){


        loginError.innerHTML =
        "من فضلك أدخل البيانات كاملة";


        return;

    }



    loginBtn.disabled = true;


    loginBtn.innerHTML =
    "جارى تسجيل الدخول...";



    try{


        const response =
await fetch(

    API +
    "?action=login" +
    "&code=" +
    encodeURIComponent(code) +
    "&password=" +
    encodeURIComponent(password)

);

const student =
await response.json();


        if(student.success){


            currentStudent = student;


            showStudent(student);

setTimeout(() => {
    loadVideos(student.grade);
}, 100);


        }

        else{


            loginError.innerHTML =
            "كود الطالب أو الرقم السرى غير صحيح";


        }



    }

    catch(error){


        console.error(error);


        loginError.innerHTML =
        "حدث خطأ أثناء الاتصال";


    }



    finally{


        loginBtn.disabled = false;


        loginBtn.innerHTML =
        '<i class="fa-solid fa-right-to-bracket"></i> دخول المنصة';


    }


}
//=========================================
// عرض بيانات الطالب
//=========================================

function showStudent(student){

    studentName.textContent = student.name;

    studentGrade.textContent = student.grade;

    studentCard.classList.remove("hidden");

}



//=========================================
// تحميل الفيديوهات
//=========================================

async function loadVideos(grade){

    console.time("Load Videos");

    videosContainer.innerHTML =
    '<div class="loading"><i class="fa-solid fa-spinner"></i> جارى تحميل الفيديوهات...</div>';

    try{

        console.time("Videos");

const response = await fetch(

    API +
    "?action=videos" +
    "&grade=" +
    encodeURIComponent(grade)

);

videos = await response.json();

console.timeEnd("Videos");
        displayVideos();

        videosCard.classList.remove("hidden");

    }catch(error){

        console.error(error);

    }

}


//=========================================
// عرض الفيديوهات
//=========================================

function displayVideos(){

    videosContainer.innerHTML="";

    let currentUnit="";

    videos.forEach(function(video,index){

        if(video.unit!==currentUnit){

            currentUnit=video.unit;

            videosContainer.innerHTML+=`

            <div class="video-unit">

                <div class="video-unit-title">

                    ${currentUnit}

                </div>

            </div>

            `;

        }

        videosContainer.innerHTML+=`

        <div class="video-card">

            <div class="lesson-number">

                الدرس ${video.lesson}

            </div>

            <div class="lesson-name">

                ${video.title}

            </div>

            <button

                class="watch-btn"

                onclick="playVideo(${index})">

                <i class="fa-solid fa-circle-play"></i>

                مشاهدة الفيديو

            </button>

        </div>

        `;

    });

}
//=========================================
// تشغيل الفيديو
//=========================================

function playVideo(index){

    currentIndex = index;

    const video = videos[index];

    videoTitle.innerHTML =
        video.unit +
        " - الدرس " +
        video.lesson +
        " : " +
        video.title;

    videoFrame.src = video.video;

    videosCard.classList.add("hidden");

    playerCard.classList.remove("hidden");

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

}



//=========================================
// الفيديو السابق
//=========================================

function previousVideo(){

    if(currentIndex<=0){

        alert("هذا أول فيديو");

        return;

    }

    playVideo(currentIndex-1);

}



//=========================================
// الفيديو التالى
//=========================================

function nextVideo(){

    if(currentIndex>=videos.length-1){

        alert("هذا آخر فيديو");

        return;

    }

    playVideo(currentIndex+1);

}



//=========================================
// الرجوع للقائمة
//=========================================

function backToVideos(){

    videoFrame.src="";

    playerCard.classList.add("hidden");

    videosCard.classList.remove("hidden");

}



//=========================================
// تسجيل الخروج
//=========================================

function logout(){

    currentStudent=null;

    videos=[];

    currentIndex=0;

    codeInput.value="";

    passwordInput.value="";

    loginError.innerHTML="";

    studentCard.classList.add("hidden");

    videosCard.classList.add("hidden");

    playerCard.classList.add("hidden");

    videoFrame.src="";

}



//=========================================
// Events
//=========================================

prevBtn.addEventListener(

    "click",

    previousVideo

);



nextBtn.addEventListener(

    "click",

    nextVideo

);



backBtn.addEventListener(

    "click",

    backToVideos

);



logoutBtn.addEventListener(

    "click",

    logout

);



//=========================================
// Enter Key
//=========================================

passwordInput.addEventListener(

    "keypress",

    function(e){

        if(e.key==="Enter"){

            login();

        }

    }

);



codeInput.addEventListener(

    "keypress",

    function(e){

        if(e.key==="Enter"){

            passwordInput.focus();

        }

    }

);