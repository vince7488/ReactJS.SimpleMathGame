import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import "./styles/main.less";
import Icon from "./favicon.ico";

const colors = {
    available: 'lightgray',
    used: 'lightgreen',
    wrong: 'lightcoral',
    temp: 'deepskyblue',
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

    return (
        <button 
            className="btn-number" 
            style={{backgroundColor: colors[props.btnStatus],}} //change the bg of the button from NumButton btnStatus
            onClick={() => console.log(props.btnNum)}>
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

    //const as inner function 
    const currentNumberStatus = (numIndex) => {

        if ( !availableNum.includes(numIndex) ) {
            return 'used'; //see ref, const color on global
        }

        if ( tempNum.includes(numIndex) ) {
            return (wrongSumNumbers) ? 'wrong' : 'temp';
        }

        return 'available';

    };

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
                                btnNum={numIndex} />
                        )}
                    </div>
                </div>

                <div className="timer">Time Remaining: 10</div>
            </div>
        </section>
    );
}

ReactDOM.render(<Game />, document.querySelector("#reactMain"));