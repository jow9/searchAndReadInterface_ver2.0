/*要素の取得*/
var worksElement = document.getElementsByClassName('works');
var readWorksElement = document.getElementsByClassName('read-works');//右コラムの取得


window.onload = function () {
  /*ページ遷移処理を作成*/
  let moveElement = document.getElementsByClassName('MoveViewPage');
  moveElement[0].addEventListener("click", function () {
    location.href = 'index.html';
  }, false);

  ReadListFile("read");//ReadListFile() → CreateClumBase(list) → ClumIntotxt(list) と順番に呼び出しページを生成する
  LogWriteFile("画面の切り替え");
}


/*
//データの読み込み
//指定したファイルからデータを読み込みmainコラム（とreadページ）を編集する
*/
function ReadListFile(article_abs) {
  console.log(article_abs + "にアクセス");
  var xmlHttpReq = new XMLHttpRequest();
  var cmd = "./rb/index.rb?cmd=read";
  var fileName = "&fn=list/" + article_abs + "ArticleList.txt";

  xmlHttpReq.open('GET', cmd + fileName, true);//ここで指定するパスは、index.htmlファイルを基準にしたときの相対パス
  xmlHttpReq.send(null);//サーバーへのリクエストを送信する、引数はPOSTのときのみ利用

  xmlHttpReq.onreadystatechange = function () {
    if ((xmlHttpReq.readyState == 4) && (xmlHttpReq.status == 200)) {
      //テキストの編集
      var list = xmlHttpReq.responseText.split(/\r\n/);
      CreateClumBase(list);//mainClum rightClumを生成する
    }
  }
}



/*
//mainClum rightClumを生成する
*/
function CreateClumBase(list) {
  for (let i = 0; i < list.length - 1; i++) {
    if (list[i] == "") { console.log("リストへの反映が終了"); break; }
    console.log(list[i] + "番記事のためのタグ要素を生成する");

    /*rightClumを作成する*/
    let txtElement = document.createElement('a');
    txtElement.className = 'read-work';
    txtElement.href = "#" + list[i];
    readWorksElement[0].appendChild(txtElement);

    /*mainClumを作成する*/
    //work-block要素の作成
    let workBlockElement = document.createElement('div');
    workBlockElement.className = 'work-block';

    //work要素の作成
    let workElement = document.createElement('div');
    workElement.className = 'work';
    workElement.id = list[i];

    //構造体の制作
    workBlockElement.appendChild(workElement);
    worksElement[0].appendChild(workBlockElement);
  }

  ClumIntotxt(list);
}

/*
//Clumにテキストを挿入する
*/
function ClumIntotxt(list) {
  let workElements = document.getElementsByClassName('work');
  let workImgElements = document.getElementsByClassName('workImg');
  let txtElements = document.getElementsByClassName('read-work');
  let xmlHttpReq = new XMLHttpRequest();
  let cmd = "./rb/index.rb?cmd=readArray";
  console.log(list[0]);
  let idArray = list[0];
  for (var i = 1; i < list.length - 1; i++) {
    idArray += "," + list[i];
  }
  console.log(idArray);
  let fileName = "&fn=" + idArray;

  xmlHttpReq.open('GET', cmd + fileName, true);//ここで指定するパスは、index.htmlファイルを基準にしたときの相対パス
  xmlHttpReq.responseType = 'json';
  xmlHttpReq.send(null);//サーバーへのリクエストを送信する、引数はPOSTのときのみ利用

  xmlHttpReq.onreadystatechange = function () {
    if ((xmlHttpReq.readyState == 4) && (xmlHttpReq.status == 200)) {
      //テキストの編集
      let article_json = xmlHttpReq.response;
      console.log(article_json);

      for (let i = 0; i < Object.keys(article_json).length; i++) {
        //1行目を見出しとする
        let txt_array = article_json[list[i]].split(/\r?\n/);
        console.log(txt_array[0]);

        /*rightclum要素の作成*/
        var h3Element = document.createElement('h3');
        h3Element.innerHTML = txt_array[0];
        txtElements[i].appendChild(h3Element);

        /*mainClumの作成*/
        //work-txt要素の作成
        let h2Element = document.createElement('h2');
        let pElement = document.createElement('p');
        h2Element.innerHTML = txt_array[0];
        for (let j = 1; j < txt_array.length; j++) {
          pElement.innerHTML += txt_array[j];
        }

        //workImg要素の作成
        let imgElement = document.createElement('img');
        imgElement.src = "src/img/" + list[i] + ".png";
        imgElement.onerror = function () {
          this.style.display = "none";
        }

        workElements[i].appendChild(h2Element);
        workElements[i].appendChild(imgElement);
        workElements[i].appendChild(pElement);
      }
    }
  }
}




/*
//ログの書き込み処理
*/
function LogWriteFile(action) {
  var now = new Date();
  console.log("ログの書き込み:" + action);

  var xmlHttpReq = new XMLHttpRequest();
  var cmd = "./rb/index.rb?cmd=logSave";

  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var date = now.getDate();
  var hour = now.getHours();
  var min = now.getMinutes();
  var sec = now.getSeconds();

  let day = year + "/" + month + "/" + date + "/ " + hour + ":" + min + ":" + sec + "  ";
  var data = "&data=" + day + action;

  xmlHttpReq.open('GET', cmd + data, true);//ここで指定するパスは、index.htmlファイルを基準にしたときの相対パス
  xmlHttpReq.send(null);//サーバーへのリクエストを送信する、引数はPOSTのときのみ利用
}
