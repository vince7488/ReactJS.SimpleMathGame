import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import "./styles/main.less";
import Icon from "./favicon.ico";

const colors = {
  available: "rgb(230,230,230)",
  used: "rgb(35,255,85)",
  wrong: "rgb(235,20,35)",
  temp: "rgb(235,195,20)"
};

// Math science
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
        setForecolor = 'rgb(255,255,255)'; //colour font to white because of the red bg, other wise, default font colour
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

function Game() {
    const [objStars, setObjStars] = useState(utils.random(1,9));

    //Represent the ideal states for how the buttons will play out
    //tempNum
    const [tempNum,setTempNum] = useState([]); //empty array to take input
    //availableNum
    const [availableNum, setAvailableNum] = useState(utils.range(1,9)); //set a range of numbers for the btns

    const wrongSumNumbers = utils.sum(tempNum) > objStars;

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
        if (getBtnStatus == 'used') {
            alert('Value is already used!');
        }

        //sub-sub function - set a newTempNum
        const newTempNums = 
        getBtnStatus === 'available' ?
        tempNum.concat(getBtnNum)
        : tempNum.filter(cn => cn !== getBtnNum);
        if ( utils.sum(newTempNums) !== objStars ) {
            //when your 
            setTempNum(newTempNums);
        } else {
            const newAvailableNums = availableNum.filter( n => !newTempNums.includes(n) );

            setObjStars(utils.randomSumIn(newAvailableNums,9));
            setAvailableNum(newAvailableNums);
            setTempNum([]);
        }

        //console.log(props.btnNum)
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
                        <StarsComponent randStarNum={objStars} />
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

                <div className="timer">Time Remaining: 10</div>
            </div>
        </section>
    );
}

ReactDOM.render(<Game />, document.querySelector("#reactMain"));