import React, { useEffect, useState } from 'react';
import axios from 'axios';
const tele = window.Telegram.WebApp;
const telegramData = tele.initDataUnsafe;

const App = () => {
  const [field, setField] = useState(new Array(4).fill(""));
  const [visible, setVisiblity] = useState(false);
  let valid = false;
  let code = field.join("")

  useEffect(() => {
    if(valid){
      axios.post("https://beatsbot0.herokuapp.com/click",{
        code: code,
        user: telegramData.user
      })
    }
  })

  const addValue = (val) =>{
    if(isNaN(val)) return false
    for(let i=4;i>-1;i--){
      if(field[i]===""){
        setField([...field.map((d, idx) => (idx === i ? val : d))]);
      }
    }
  }

  const handleChange = (element, index) => {
    // if (isNaN(element.value)) return false;
    // element.value = value
    // setField([...field.map((d, idx) => (idx === index ? element.value : d))]);
    console.log(element)
    //Focus input suivant
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  let Icon = visible ? "eye-slash" : "eye";

  let InputType = visible ? "text" : "password";

  return (
    <div>
      <div className="container-content">
        <div className="otp-container">
          <div className="nav d-flex align-item-center">
            <img src="./logo.png" alt="" />
          </div>
          <div className="text">
            <p>Veuillez entrer le code secret</p>
          </div>
          <div className="otp-input d-flex">
            {field.map((data, index) => {
              return (
                <input
                  className="input"
                  type={InputType}
                  name="codeS"
                  maxLength="1"
                  key={index}
                  value={data}
                  onChange={e => {handleChange(e.target, index)
                    console.log(e)
                  }}
                  onFocus={e => e.target.select()}
                  disabled
                />
                
              );
            })}
          </div>
          {
            code.length<4 ? <span className="text-danger">
            <i className="fas fa-exclamation-triangle"></i>
            Remplissez tous les champs SVP!
          </span> : ""
          }
          
          <div className="keyboard d-flex flex-wrap">
            <button className="btn num-1 num" onClick={() => {addValue("1")}} >1</button>
            <button className="btn num-2 num" onClick={() => {addValue("2")}} >2</button>
            <button className="btn num-3 num" onClick={() => {addValue("3")}}>3</button>
            <button className="btn num-4 num" onClick={() => {addValue("4")}}>4</button>
            <button className="btn num-5 num" onClick={() => {addValue("5")}}>5</button>
            <button className="btn num-6 num" onClick={() => {addValue("6")}}>6</button>
            <button className="btn num-7 num" onClick={() => {addValue("7")}}>7</button>
            <button className="btn num-8 num" onClick={() => {addValue("8")}}>8</button>
            <button className="btn num-9 num" onClick={() => {addValue("9")}}>9</button>
            <button className="btn num-n num" 
             onClick={() => setVisiblity(visiblity => !visiblity)}
            >
              <i className={'fas fa-'+Icon} ></i>
            </button>
            <button className="btn num-0 num" onClick={() => {addValue("0")}}>0</button>
            <button className="btn remove"
            onClick={e => setField([...field.map(v => "")])}
            ><i className="fas fa-backspace"></i></button>
            <button className="btn btn-verify d-flex align-item-center justify-content-center"
            >
              valider
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default App;