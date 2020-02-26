import React, { useState,useEffect } from 'react';
import ReactDOM from 'react-dom';
import "./styles/main.less";
import Icon from "./favicon.ico";

const colors = {
  available: "rgb(230,230,230)",
  used: "rgb(35,255,85)",
  wrong: "rgb(235,20,35)",
  temp: "rgb(235,195,20)"
};

//Here is the math of it
const utils = {
    // Sum an array
    sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

    // create an array of numbers between min and max (edges included)
    range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

    // pick a random number between min and max (edges included)
    random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

    // Given an array of numbers and a max...
    // Pick a random sum (< max) from the set of all available sums in arr
    randomSumIn: (arr, max) => {
        const sets = [[]];
        const sums = [];
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0, len = sets.length; j < len; j++) {
                const candidateSet = sets[j].concat(arr[i]);
                const candidateSum = utils.sum(candidateSet);
                if (candidateSum <= max) {
                    sets.push(candidateSet);
                    sums.push(candidateSum);
                }
            }
        }
        return sums[utils.random(0, sums.length - 1)];
    },
    //adding a new math util to create a random number from a set min and max
    randomiseSession: (min,max) => {
        return Math.floor(Math.random(min) * Math.floor(max));
    },
};

function StarsComponent(props) {

    return(
        <>
            {utils.range(1,props.randStarNum).map( starId =>
                <div key={starId} className="star" />    
            )}
        </>
    );
}

function NumButton(props) {
    let setForecolor = "initial"; //I just want to to be special...

    if (props.btnStatus == 'wrong') {
        setForecolor = 'rgb(255,255,255)'; //colour font to white because of the red bg, other wise, default font colour (initial)
    }

    return (
    <button
        className="btn-number"
        style={{ backgroundColor: colors[props.btnStatus],color: setForecolor }} //change the bg of the button from NumButton btnStatus
        onClick={() => props.onClick(props.btnNum,props.btnStatus)} //pass btnNum value, pass Status ==> Game()
    >
        {props.btnNum}
    </button>
    );
}

//Component Button to reset the game after its done
function ResetGame(props) {
    //see the controller for this button in const reInitialise
    return (
        <>
            <div>
                <span className={`game-end-stat ${((props.gameStat === 'lost') ? 'islost' : 'iswon')}`}>
                    {(props.gameStat === 'lost') ? 'Game Over' : 'Great!'}
                </span>
            </div>

            <button onClick={props.onClick}>
                Play Again!
            </button>
        </>
    );
}

function Game() {
    const [objStars, setObjStars] = useState(utils.random(1, 9)); //create stars randomly
    const [tempNum,setTempNum] = useState([]); //empty array to take input
    const [availableNum, setAvailableNum] = useState(utils.range(1,9)); //set a range of numbers for the input btns
    const [countDownTimer,setCountDownTimer] = useState(10); //Initialise the countDown Timer to 10
    
    //React.useEffect to run the JS script setTimeout()
    useEffect(() => {

        //as long as countDownTimer has not been depleted to 0 
        //AND playing btns not used up...
        if (countDownTimer > 0 && availableNum.length > 0) {
            //add const initTimer for cleaning useEffect...
            const initTimer = setTimeout(() => {
                setCountDownTimer(countDownTimer - 1); //subtract "1" from countDown state...
            }, 1000); //...every 1000 milliseconds
            console.log('initTimer ended');

            return () => {
                clearTimeout(initTimer)
                console.log('initTimer refreshed');
            };
        }
    });

    //variable to trigger when Sum is wrong
    const wrongSumNumbers = utils.sum(tempNum) > objStars;

    //const gameComplete = availableNum.length === 0; //outed, in favour of gameStat

    //initialise game Status: if availableNum = 0, win; if countDownTimer = 0 & availableNum > 0, lost; If Neither, game status is active.
    const gameStat = (availableNum.length === 0) ? 'win' :
        (countDownTimer <= 0 && availableNum.length > 0) ? 'lost' : 'active';

    //Now Unused... "unmounting method" is now used by Game() to launch the StarSums() component
    /* const reInitialise = props => {
        setObjStars(utils.random(1, 9));
        setAvailableNum(utils.range(1, 9));
        setTempNum([]);
        setCountDownTimer(10);
        console.clear();
    } */

    //const as inner function | currentNumberStatus determines the status of NumButton Component
    const currentNumberStatus = (numIndex) => {
        //numIndex plays as the button values
        if ( !availableNum.includes(numIndex) ) {
            return 'used'; //see ref, const color on global
        }

        if ( tempNum.includes(numIndex) ) {
            return (wrongSumNumbers) ? 'wrong' : 'temp';
        }

        return 'available';

    };

    //When you click one of the NumButton, take the btnNum value and btnStatus state
    const onNumButtonClk = (getBtnNum,getBtnStatus) => {
        //from const currentNumberStatus component...
        if (getBtnStatus === 'used' && gameStat === 'active') {
            alert('Value is already used!'); //picked a button already used
        } else if (gameStat !== 'active') {
            return; //do nothing when game is not active (lost or won)
        } else {
            console.log(getBtnNum) //Just tripping...
        }

        //sub-sub function - set a newTempNum
        const newTempNums = 
        getBtnStatus === 'available' ?
        tempNum.concat(getBtnNum) 
        : tempNum.filter(cn => cn !== getBtnNum); //if btn is available, set current Num as a newTempNum
        //when the sum of your newTempNum is not equal to the current num of stars 
        if ( utils.sum(newTempNums) !== objStars ) {
            //put the newTempNum in the array group (marking it as "used")
            setTempNum(newTempNums);
        } else {
            //if a number is not in the Tempnum array storage, mark it as newAvailableNum
            const newAvailableNums = availableNum.filter( n => !newTempNums.includes(n) );
            //refresh the number of stars now with min of Currently AvailableNums and the max (9)
            setObjStars(utils.randomSumIn(newAvailableNums,9));
            //Set the new AvailableNums
            setAvailableNum(newAvailableNums);
            //Clear the TempNum array
            setTempNum([]);
        }
    }

    return (
        <section>
            <header>
                <h1>Star Sum!</h1>
            </header>
            <div className="game">
                <h2 className="help">
                    Pick 1 or more numbers that sum to the number of stars
            </h2>
                <div className="body">

                    <div className="left">
                        {
                            (gameStat !== 'active') ? <ResetGame onClick={reInitialise} gameStat={gameStat} />
                            :
                            <StarsComponent randStarNum={objStars} />
                        }
                        
                    </div>

                    <div className="right">
                        {utils.range(1,9).map(numIndex =>
                            <NumButton 
                                key={numIndex}
                                btnStatus={currentNumberStatus(numIndex)}
                                btnNum={numIndex} 
                                onClick={onNumButtonClk} //run the function to set Status; 
                            />
                        )}
                    </div>

                </div>

                <div className="timer">Time Remaining: {countDownTimer}</div>
            </div>
        </section>
    );
}

ReactDOM.render(<Game />, document.querySelector("#reactMain"));