


const QUIZ_API= 'https://opentdb.com/api.php?amount=10';
const OPTIONS_URL ='https://opentdb.com/api_category.php';

const categoryList = document.getElementById('categoryList');
const difficultyList = document.getElementById('difficultyList');
const submitBtn = document.getElementById('subBtn');




const quizOptions = document.getElementById('quizHeader');

const quiz = document.getElementById('quizBox');
const quizQuestion = document.getElementById('question');
const quizAnswers = document.getElementById('answers');

const tryAgainBtn = document.getElementById('restartBtn');
const nextBtn = document.getElementById('next');
const earnedPoints = document.getElementById('points');
const pointsResult = document.getElementById('pointsResult');
let n = 0;
let score = 0;
let categoryHTML = ''
const options = {
    category:'',
    difficulty:'',
}

async function getData(category,difficulty) {
    const resArray = []
    try{
        const dataHolder = await fetch(QUIZ_API + `&category=${category}`+`&difficulty=${difficulty}`);
        const data = await dataHolder.json();
        data.results.forEach( res => resArray.push(res) );
        renderFirstQuestion(resArray);
       }
    catch(err){
                console.log('Error')
              }
 }
getOptions()

async function getOptions() {
    try{
        const dataHolder = await fetch(OPTIONS_URL);
        const data = await dataHolder.json();
        renderCategory(data)
    }
    catch(err){console.log(err)}
}

function getListItemValue(categoryListID,difficultyListID){
    const categoryList = document.getElementById(categoryListID);
    const difficultyList = document.getElementById(difficultyListID);

    for (let i = 0; i < categoryList.children.length; i++) {
        categoryList.children[i].addEventListener('click',()=>{
            options.category = categoryList.children[i].id
            toggleClass(categoryList,'list-open')
        })
    }
    for (let i = 0; i < difficultyList.children.length; i++) {
        difficultyList.children[i].addEventListener('click',(e)=>{
            options.difficulty = difficultyList.children[i].id;
            toggleClass(difficultyList,'list-open')
            startQuiz(options.category,options.difficulty)
        })
    }

}



function openOptions(buttonID,listEl){
    const btn = document.getElementById(buttonID)
    const list = document.getElementById(listEl)
    btn.addEventListener('click',()=>{
        toggleClass(list,'list-open')
    })
}

function removeClass(el,elClass){
   const element = document.querySelectorAll(el)
    element.forEach(e => {
        e.classList.remove(elClass)
    })

}

function toggleClass(el,elStyle) {
    el.classList.toggle(elStyle)
}




openOptions('categoryBtn','categoryList')
openOptions('difficultyBtn','difficultyList')


function startQuiz(category,difficulty){
    submitBtn.addEventListener('click', () => {
        n = 0;
        event.preventDefault()
        removeClass('.title','options__fadeIn')
        getData(category,difficulty);
        quiz.classList.toggle('quiz-show')
        quizOptions.style.display = 'none';
    })
}
startQuiz(options.category,options.difficulty)

function renderFirstQuestion(resArray) {
    const answersArray1 = [];
    resArray[0].incorrect_answers.forEach(answer => {
        answersArray1.push(answer)
    })
    answersArray1.push(resArray[0].correct_answer)
    shuffleQuizAnswersArray(answersArray1)
    arrayHtml(resArray,answersArray1)
    nextQuizQuestions(resArray,answersArray1)
    correctAnswer(resArray)
}
function renderCategory(data){
    data.trivia_categories.forEach( category =>{
        categoryHTML += ` <li id="${category.id}">
                            <p>${category.name}</p>
                         </li>`
    })
    categoryList.innerHTML += categoryHTML
    getListItemValue('categoryList','difficultyList')

}

function nextQuizQuestions(resArray,answersArray1){
    arrayHtml(resArray,answersArray1)

    nextBtn.addEventListener('click', () =>{
        if(n === resArray.length - 1){
            n = 0;
            quiz.style.display = 'none';
            earnedPoints.innerHTML = score;
            pointsResult.classList.add('show-result')
        }
        n++
        const answersArray2 = [];
        resArray[n].incorrect_answers.forEach(answer => {
            answersArray2.push(answer)
        })
        answersArray2.push(resArray[n].correct_answer)
        shuffleQuizAnswersArray(answersArray2)
        showNextQuestion(resArray, answersArray2)
    })

}
function shuffleQuizAnswersArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * array.length);
        [array[i], array[j]] = [array[j], array[i]];
    }
}
function arrayHtml(resArray,answersArray1){
    if(resArray[0].type !=='boolean') {
        quizAnswers.innerHTML =
   `<div class="btn-wrapper">
     <button class="answerBtn" value="${answersArray1[0]}">${answersArray1[0]}</button>
    </div>
    <div class="btn-wrapper">
     <button class="answerBtn" value="${answersArray1[1]}">${answersArray1[1]}</button>
    </div>
    <div class="btn-wrapper">
     <button class="answerBtn" value="${answersArray1[2]}">${answersArray1[2]}</button>
    </div>
    <div class="btn-wrapper">
     <button class="answerBtn" value="${answersArray1[3]}">${answersArray1[3]}</button>
    </div>`
    }
    if(resArray[0].type ==='boolean') {
        quizAnswers.innerHTML =
       ` <div class="btn-wrapper">
         <button class="answerBtn" value="${answersArray1[0]}">${answersArray1[0]}</button>
         </div>
         <div class="btn-wrapper">
         <button class="answerBtn" value="${answersArray1[1]}">${answersArray1[1]}</button>
         </div>`
    }
    quizQuestion.innerHTML = `${resArray[0].question}`;
    quizQuestionLetters()
}
function showNextQuestion(resArray, answersArray2 ){
    if(resArray[n].type !=='boolean') {
        quizAnswers.innerHTML =
        `<div class="btn-wrapper">
         <button class="answerBtn" value="${answersArray2[0]}">${answersArray2[0]}</button>
         </div>
         <div class="btn-wrapper">
         <button class="answerBtn" value="${answersArray2[1]}">${answersArray2[1]}</button>
         </div>
         <div class="btn-wrapper">
         <button class="answerBtn" value="${answersArray2[2]}">${answersArray2[2]}</button>
         </div>
         <div class="btn-wrapper">
         <button class="answerBtn" value="${answersArray2[3]}">${answersArray2[3]}</button>
         </div>`
    }
    if(resArray[n].type ==='boolean') {
        quizAnswers.innerHTML = `
    <div class="btn-wrapper">
        <button class="answerBtn" value="${answersArray2[0]}">${answersArray2[0]}</button>
    </div>
    <div class="btn-wrapper">
        <button class="answerBtn" value="${answersArray2[1]}">${answersArray2[1]}</button>
    </div>`
    }
    quizQuestion.innerHTML = `${resArray[n].question}`;
    correctAnswer(resArray)
    quizQuestionLetters()
}

function correctAnswer(resArray){
    for (let i = 0; i < quizAnswers.children.length; i++) {
        quizAnswers.children[i].addEventListener('click', (e) => {
            if(e.target.value === resArray[n].correct_answer){
                e.target.parentNode.classList.add('correctAnswer');
                score +=1
            }
            if(e.target.value !== resArray[n].correct_answer){
                e.target.parentNode.classList.add('wrongAnswer');
            }
            quizAnswers.children[i].children[0].setAttribute("disabled", "disabled")
            for (let j = 0; j < quizAnswers.children.length; j++){
                if(j < i || j > i){
                        if( quizAnswers.children[j].children[0].innerHTML === resArray[n].correct_answer ){
                            quizAnswers.children[j].children[0].classList.add('correctAnswer');
                        }
                        else {
                            quizAnswers.children[j].children[0].classList.add('wrongAnswer');
                            quizAnswers.children[j].children[0].setAttribute("disabled", "disabled")
                            }
                }
             }
        })
    }
}
function quizQuestionLetters() {
         if(quizQuestion.innerHTML.includes('u')){
           quizQuestion.innerHTML=quizQuestion.innerHTML.replace('u','<span style="color:#fd0000;">u</span>');
            }
        if (quizQuestion.innerHTML.includes('i')) {
            quizQuestion.innerHTML = quizQuestion.innerHTML.replace( 'i', `<span style="color:#0fe300">i</span>`);
            }
        if (quizQuestion.innerHTML.includes('z')) {
            quizQuestion.innerHTML = quizQuestion.innerHTML.replace('z', '<span style="color:#b222d2;;">z</span>');
            }
    }

tryAgainBtn.addEventListener('click',() => {
    location.reload()
})












