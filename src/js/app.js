import { Message } from "./message";
import { validateCoords } from "./validateCoords";

document.addEventListener("DOMContentLoaded", () => {
  const btnAddTextMessage = document.querySelector(".add-mesage");
  const btnAudioMessage = document.querySelector(".add-audio");
  const btnVideoMessage = document.querySelector(".add-video");
  const inputText = document.querySelector(".input-text");
  let userCoords;
  let videoPermisiion;
  let audioPermisiion;
  let timer;

  let recorder;
  let videoPlayer;
  let stream;
  let src;

  let audioPlayer;

  const getPermissionCoords = async function () {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (data) => {
          const { latitude, longitude } = data.coords;
          userCoords = [latitude, longitude];
          resolve(userCoords);
        },
        async function () {
          coordsErrorForm();
          let formError = document.querySelector(".form-error");
          let btnSendCoords = document.querySelector(".btn-send-coords");
          let btnClose = document.querySelector(".form-close");
          let textarea = document.querySelector(".textarea-form-error");

          btnClose.addEventListener("click", async () => {
            alert("Введите координаты!");
          });

          btnSendCoords.addEventListener("click", async (e) => {
            e.preventDefault();
            let coords = await textarea.value;
            console.log("данные получили");
            if (!coords || coords == " " || coords == "\n") {
              console.log("Координат нет!");
              alert("Координат нет!");
              return;
            } else if (validateCoords(coords)) {
              coords = validateCoords(coords);
              userCoords = coords;
              resolve(userCoords);
              formError.remove();
              console.log("данные коректные");
            }
          });
        }
      );
    });
  }; // получение координат и валидация

  const getPermissionAudio = async function () {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      audioPlayer = new Message(userCoords);
      audioPlayer.createtUlList();
      let li = audioPlayer.createAudio();

      let audioPlayerElement = li.querySelector(".audio");
      audioPlayerElement.classList.add("recording");
      audioPlayer.createAttribute(li);

      // videoPlayerElement.srcObject = stream;
      // videoPlayerElement.addEventListener("canplay", () => {
      //   videoPlayerElement.play();
      // });

      recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.start();

      recorder.addEventListener("start", () => {
        console.log("start");
      });

      recorder.addEventListener("dataavailable", (event) => {
        chunks.push(event.data);
      });

      recorder.addEventListener("stop", () => {
        const blob = new Blob(chunks);

        audioPlayerElement.src = URL.createObjectURL(blob);
        src = URL.createObjectURL(blob);
      });

      audioPermisiion = true;
    } catch (error) {
      console.log(error);
      alert(
        "Предоставьте доступ к микрофону, чтобы записывать аудио-сообщения!"
      );
    }
  }; // получение разрешения на аудио

  const getPermissionVideo = async function () {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      videoPlayer = new Message(userCoords);
      videoPlayer.createtUlList();
      let li = videoPlayer.createVideo();

      let videoPlayerElement = li.querySelector(".video");
      videoPlayerElement.classList.add("recording");
      videoPlayer.createAttribute(li);

      // videoPlayerElement.srcObject = stream;
      // videoPlayerElement.addEventListener("canplay", () => {
      //   videoPlayerElement.play();
      // });

      recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.start();

      recorder.addEventListener("start", () => {
        console.log("start");
      });

      recorder.addEventListener("dataavailable", (event) => {
        chunks.push(event.data);
      });

      recorder.addEventListener("stop", () => {
        const blob = new Blob(chunks);

        videoPlayerElement.src = URL.createObjectURL(blob);
        src = URL.createObjectURL(blob);
      });

      videoPermisiion = true;
    } catch (error) {
      console.log(error);
      alert("Предоставьте доступ к камере, чтобы записывать видео-сообщения!");
    }
  }; // получение разрешения на видео

  const coordsErrorForm = () => {
    let form = ` <form class="form-error">
              <div class="form-error-title">
                  <div class="title-error">Что то пошло не так :(</div>
                  <div class="form-close"></div>
              </div>
              <div class="error-description">К сожалению, нам не удалось опрделить ваше местоположение.
              Пожалуйста, дайте разрешение на использование геолокации, либо введите координаты вручную.
              Широта и долгота через запятую.
              </div>
              <textarea class="textarea-form-error" placeholder="Ваши координаты"></textarea>
              <button class="btn-send-coords">Отправить</button>
          </form>`;
    document.body.insertAdjacentHTML("afterbegin", form);
  }; // создание формы если доступ к координатам недоступен

  const sendTextMessage = async function (e) {
    if (e instanceof KeyboardEvent) {
      if (e.key === "Enter") {
        e.preventDefault();
      } else return;
    }

    if (!userCoords) {
      await getPermissionCoords();
    }

    let inputText = document.querySelector(".input-text");
    let text = inputText.value;
    if (text == "") text = "Пустое сообщение :(";

    let newMessage = new Message(userCoords);
    newMessage.createtUlList();
    let msgElement = newMessage.createMsg(text);
    newMessage.createAttribute(msgElement);

    inputText.value = "";
  }; // стандартная функция отправка текстовых сообщений. ее слушаем обычно если не записываем видео или аудио

  const startRecordAudio = async () => {
    if (!userCoords) await getPermissionCoords();
    await getPermissionAudio();

    if (!audioPermisiion) return;

    console.log("audio");

    btnAddTextMessage.classList.add("check-mark");
    btnVideoMessage.classList.add("cross");
    btnAudioMessage.classList.add("timer");

    btnAudioMessage.classList.remove("btn");
    btnAudioMessage.classList.remove("add-audio");

    btnAddTextMessage.removeEventListener("click", sendTextMessage);
    btnVideoMessage.removeEventListener("click", startRecordVideo);

    btnAddTextMessage.addEventListener("click", sendAudio);
    btnVideoMessage.addEventListener("click", deleteAudio);
    createTimer();
  }; // по стандарту слушаем на кнопке аудио

  const sendAudio = async function () {
    console.log("send audio");
    btnAddTextMessage.classList.remove("check-mark");
    btnVideoMessage.classList.remove("cross");

    btnAddTextMessage.removeEventListener("click", sendAudio);
    btnVideoMessage.removeEventListener("click", deleteAudio);

    btnAddTextMessage.addEventListener("click", sendTextMessage);
    btnVideoMessage.addEventListener("click", startRecordVideo);

    btnAudioMessage.classList.add("btn");
    btnAudioMessage.classList.add("add-audio");

    let player = document.querySelector(".recording");
    player.classList.remove("recording");

    recorder.stop();
    stream.getTracks().forEach((track) => track.stop());

    deleteTimer();
  }; // функция отправки аудио

  const deleteAudio = async function () {
    console.log("delete audio");
    btnAddTextMessage.classList.remove("check-mark");
    btnVideoMessage.classList.remove("cross");

    btnAddTextMessage.removeEventListener("click", sendAudio);
    btnVideoMessage.removeEventListener("click", deleteAudio);

    btnAddTextMessage.addEventListener("click", sendTextMessage);
    btnVideoMessage.addEventListener("click", startRecordVideo);

    btnAudioMessage.classList.add("btn");
    btnAudioMessage.classList.add("add-audio");

    recorder.stop();
    stream.getTracks().forEach((track) => track.stop());

    let player = document.querySelector(".recording");
    let msg = player.parentNode;
    msg.remove();
    player.remove();

    deleteTimer();
  }; // функция удаления аудио

  const startRecordVideo = async () => {
    if (!userCoords) await getPermissionCoords();
    await getPermissionVideo();

    if (!videoPermisiion) return;

    btnAddTextMessage.classList.add("check-mark");
    btnVideoMessage.classList.add("cross");
    btnAudioMessage.classList.add("timer");

    btnAudioMessage.classList.remove("btn");
    btnAudioMessage.classList.remove("add-audio");

    btnAddTextMessage.removeEventListener("click", sendTextMessage);
    btnVideoMessage.removeEventListener("click", startRecordVideo);

    btnAddTextMessage.addEventListener("click", sendVideo);
    btnVideoMessage.addEventListener("click", deleteVideo);

    createTimer();
  }; // по стандарту слушаем на кнопке видео

  const sendVideo = async function () {
    console.log("send video");
    btnAddTextMessage.classList.remove("check-mark");
    btnVideoMessage.classList.remove("cross");

    btnAddTextMessage.removeEventListener("click", sendVideo);
    btnVideoMessage.removeEventListener("click", deleteVideo);

    btnAddTextMessage.addEventListener("click", sendTextMessage);
    btnVideoMessage.addEventListener("click", startRecordVideo);

    btnAudioMessage.classList.add("btn");
    btnAudioMessage.classList.add("add-audio");

    let player = document.querySelector(".recording");
    player.classList.remove("recording");

    recorder.stop();
    stream.getTracks().forEach((track) => track.stop());

    deleteTimer();
  }; // функция отправки видео

  const deleteVideo = async function (e) {
    console.log("delete video");
    btnAddTextMessage.classList.remove("check-mark");
    btnVideoMessage.classList.remove("cross");

    btnAddTextMessage.removeEventListener("click", sendVideo);
    btnVideoMessage.removeEventListener("click", deleteVideo);

    btnAddTextMessage.addEventListener("click", sendTextMessage);
    btnVideoMessage.addEventListener("click", startRecordVideo);

    btnAudioMessage.classList.add("btn");
    btnAudioMessage.classList.add("add-audio");

    recorder.stop();
    stream.getTracks().forEach((track) => track.stop());

    let player = document.querySelector(".recording");
    let msg = player.parentNode;
    msg.remove();
    player.remove();

    deleteTimer();
  }; // функция удаления видео

  const createTimer = () => {
    let timer_ = document.querySelector(".timer");
    let minutes = 0;
    let seconds = 0;
    timer_.textContent = `0${minutes}:0${seconds}`;

    timer = setInterval(() => {
      timer_.textContent = `${minutes}:${seconds++}`;

      if (String(seconds).length == 1 && String(minutes).length == 1) {
        timer_.textContent = `0${minutes}:0${seconds}`;
      } else if (String(seconds).length > 1 && String(minutes).length == 1) {
        timer_.textContent = `0${minutes}:${seconds}`;
      }

      if (seconds > 59) {
        seconds = 0;
        if (String(minutes).length == 1) {
          timer_.textContent = `0${minutes++}:${seconds}`;
        } else {
          timer_.textContent = `${minutes++}:${seconds}`;
        }
      }
    }, 1000);
  }; // создаем таймер

  const deleteTimer = () => {
    clearInterval(timer);
    btnAudioMessage.classList.remove("timer");
    btnAudioMessage.textContent = "";
  }; //удаляем таймер

  inputText.addEventListener("keypress", sendTextMessage);
  btnAddTextMessage.addEventListener("click", sendTextMessage);

  btnVideoMessage.addEventListener("click", startRecordVideo);
  btnAudioMessage.addEventListener("click", startRecordAudio);
});

//       -  1  2  3  .  4  5  6  ,     -  7  8  9  .  1  2  3
