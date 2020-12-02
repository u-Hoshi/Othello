// 初期画面起動時
var turn = 0 //ターン、黒1；白-1
//盤面の状況を二次元配列で定義
var ban_ar = new Array(8) //ここで要素数が8の配列にする
for (var x = 0; x < ban_ar.length; x++){
    ban_ar[x]=new Array(8)
}
// console.log(ban_ar)
//インデックスは-0からだがarray(要素数)は1から数える

//htmlで定義したテーブルを取得
var ban = document.getElementById("field")


//取得したテーブルに盤面を作成
function ban_new() {
    for (var x = 0; x < 8; x++){
        var tr = document.createElement("tr")
        ban.appendChild(tr)
        for (var y = 0; y < 8; y++){
            var td = document.createElement("td")
            tr.appendChild(td)
        }
    }
}
ban_new()

//盤面の初期化
ban_init()

//クリックしたときの実行されるイベント
for (var x = 0; x < 8; x++){
    for (var y = 0; y < 8; y++) {
        var select_cell = ban.rows[x].cells[y];
        select_cell.onclick = function () {
            if (ban_ar[this.parentNode.rowIndex][this.cellIndex] == 0) {
                if (check_reverse(this.parentNode.rowIndex, this.cellIndex) > 0) {
                    ban_set()
                    cheng_turn()
                }
            }
        }
    }
}


//テーブルで盤面を作成する処理
// function ban_new() {
//     for (var x = 0; x < 8; x++){
//         var tr = document.createElement("tr")
//         ban.appendChild(tr)
//         for (var y = 0; y < 8; y++){
//             var td = document.createElement("td")
//             tr.appendChild(td)
//         }
//     }
// }


//ここまで書いたら緑色の盤面が表示される


function ban_init () {
    //すべてクリア
    for (var x = 0; x < 8; x++) {
        for (var y = 0; y < 8; y++){
            ban_ar[x][y] = 0
        }
    }
    //初期状態では真ん中に白黒を配列
    ban_ar[3][3] = 2
    ban_ar[4][3] = 1
    ban_ar[3][4] = 1
    ban_ar[4][4] = 2
    ban_ar[5][4] = 3
    ban_ar[4][5] = 3
    ban_set()
    
    //ターンも初期化
    turn = 0
    cheng_turn()

    // 追加実装 途中経過
    var white_cnt = 2
     var black_cnt = 2
    var progress = document.getElementById("progress")
    progress.textContent="白" + white_cnt+ "黒"+black_cnt
    document.getElementById("btn_progress").onclick = function() {
    alert("白" + white_cnt + "黒" + black_cnt)
    };
    // 追加実装 途中経過 end
}

//盤面状況を実際の盤面に反映させる処理

function ban_set() {
    var stone = ""
    for (var x = 0; x < 8; x++){
        for (var y = 0; y < 8; y++){
            switch (ban_ar[x][y]) {
                case 0:
                    stone = ""
                    break;
                case 2:
                    stone = "○"
                    break;
                case 3:
                    stone = "★"
                    break;
                case 1:
                    stone = "●"
                    break;
            }
            ban.rows[x].cells[y].innerText = stone;
        }
    }
    return true
}

//ターンを変更する時の処理
function cheng_turn() {
    var tarn_msg = document.getElementById("view_tarn")
    if (turn == 0) {
        turn = 1
        tarn_msg.textContent = "黒の番です"
        return
    }
    //ターンを変更
    turn = (turn + 1) % 3+1
    console.log(turn)
    //ターンを交代して、置けるところがあるかを確認する
    //現状の配置をバックアップ
    var ban_bak = new Array(8)
    var check_reverse_cnt = 0
    for (var i = 0; i < ban_ar.length; i++) {
        ban_bak[i] = new Array(8)
    }
    for (var x = 0; x < 8; x++) {
        for (var y = 0; y < 8; y++) {
            ban_bak[x][y] = ban_ar[x][y]
        }
    }
    //ここまでバックアップのための記述
    var white_cnt = 0
    var black_cnt = 0
    var star_cnt=0
    for (var x = 0; x < 8; x++) {
        for (var y = 0; y < 8; y++) {
            //空白マスのみおけるのでチェック
            //それ以外は石の数の計算
            switch (ban_ar[x][y]) {
                case 0:
                    check_reverse_cnt = check_reverse_cnt + check_reverse(x, y)
                    //バックアップから元に戻す
                    // console.log(check_reverse_cnt)
                    for (var i = 0; i < 8; i++) {
                        for (var ii = 0; ii < 8; ii++) {
                            ban_ar[i][ii] = ban_bak[i][ii]
                        }
                    }
                    break;
                case 3:
                    star_cnt = star_cnt + 1
                    break;
                case 2://マスに白石があるという事
                    white_cnt = white_cnt + 1
                    break
                case 1:
                    black_cnt = black_cnt + 1
                    break
            }
        }
    }
    //白と黒の合計が8*8=64の場合は終了
    if (white_cnt + black_cnt+star_cnt == 64 ||star_cnt==0 || white_cnt == 0 || black_cnt == 0) {
        if (white_cnt == black_cnt) {
            alert("引き分けです")
        } else if (star_cnt==0) {
            alert("白の負け")
        } else if (black_cnt==0) {
            alert("黒の負け")
        }
             else if (white_cnt==0) {
            alert("白の負け")
        }
        else {
            alert("勝負は黒:" + black_cnt + "対、白：" + white_cnt + "で黒の勝ちです")
        }
    } else {
        //置ける場所がない場合はターンを相手に戻す
        if (check_reverse_cnt == 0) {
            switch (turn) {
                case 2:
                    alert("白のおける場所がありません。続けて星の番になります")
                    turn = (turn + 1) % 3+1
                    break;
                case 1:
                    alert("黒のおける場所がありません。続けて白の番となります。")
                    turn = (turn + 1) % 3+1
                    break;
                case 3:
                    alert("星のおける場所がありません。続けて白の番となります。")
                    turn = (turn + 1) % 3+1
                    break;
            }
        }
    }
    //ターンを表示
    switch (turn) {
        case 2:
            tarn_msg.textContent = "白の番です";
            break;
        case 1:
            tarn_msg.textContent = "黒の番です";
            break;
         case 3:
            tarn_msg.textContent = "星の番です";
            break;
    }
    // 独自機能

    // 途中経過確認
    var progress = document.getElementById("progress")
    progress.textContent = "白" + white_cnt + "黒" + black_cnt+"星"+star_cnt
    //     function btn_progress(){
    // alert("白" + white_cnt+ "黒"+black_cnt)
    // }ボツ
    document.getElementById("btn_progress").onclick = function () {
        alert("白" + white_cnt + "黒" + black_cnt)
    };
    //途中経過確認end
    
    // 特定のマスだけ高ポイント
    // switch(ban_ar[3][4]){
    //             case 0:
    //                 check_reverse_cnt = check_reverse_cnt + check_reverse(x, y)
    //                 //バックアップから元に戻す
    //                 // console.log(check_reverse_cnt)
    //                 for (var i = 0; i < 8; i++){
    //                     for (var ii = 0; ii < 8; ii++){
    //                         ban_ar[i][ii]=ban_bak[i][ii]
    //                     }
    //                 }
    //             break;
    //             case -1://マスに白石があるという事
    //                 white_cnt = white_cnt + 100;
    //             break
    //             case 1:
    //                 black_cnt = black_cnt + 100;
    //             break
    // }
    // 特定のマスだけ高ポイントend

    // 特定のマスに石を置いた時点で勝敗決着
    // switch(ban_ar[1][1]){
    //             case 0:
    //                 check_reverse_cnt = check_reverse_cnt + check_reverse(x, y)
    //                 //バックアップから元に戻す
    //                 // console.log(check_reverse_cnt)
    //                 for (var i = 0; i < 8; i++){
    //                     for (var ii = 0; ii < 8; ii++){
    //                         ban_ar[i][ii]=ban_bak[i][ii]
    //                     }
    //                 }
    //             break;
    //             case -1://マスに白石があるという事
    //                 alert("独自ルールにより白勝ち")
    //                 tarn_msg.textContent = "白の勝ち";
    //             break
    //             case 1:
    //                 alert("独自ルールにより黒勝ち")
    //                 tarn_msg.textContent = "黒の勝ち";
    //             break
    // }
    // if文を使った特定のマスに石を置いた時点で勝敗決着
    // if (ban_ar[2][2] == -1) {
    //     alert("独自ルールにより白")
    //     tarn_msg.textContent = "白の勝ち";
    // } else if(ban_ar[2][2] == 1) {
    //     alert("独自ルールにより黒")
    //     tarn_msg.textContent = "黒の勝ち";
    // }
    // 特定のマスに石を置いた時点で勝敗決着end
};

//指定したセルにターン側の石が置ける確認
function check_reverse(row_index, cell_index) {
    var reverse_cnt = 0
    // 各方向へリバースできるか確認
    reverse_cnt = reverse_cnt + line_reverse(row_index, cell_index, -1, 0)
    reverse_cnt = reverse_cnt + line_reverse(row_index, cell_index, -1, 1)
    reverse_cnt = reverse_cnt + line_reverse(row_index, cell_index, 0, 1)
    reverse_cnt = reverse_cnt + line_reverse(row_index, cell_index, 1, 1)
    reverse_cnt = reverse_cnt + line_reverse(row_index, cell_index, 1, 0)
    reverse_cnt = reverse_cnt + line_reverse(row_index, cell_index, 1, -1)
    reverse_cnt = reverse_cnt + line_reverse(row_index, cell_index, 0, -1)
    reverse_cnt = reverse_cnt + line_reverse(row_index, cell_index, -1, -1)

    
    return reverse_cnt
}

//指定したセルから指定した方向へのreverseを行う
function line_reverse(row_index, cell_index, add_x, add_y) {
    //最初に今の盤状況を対比する
    var ban_bak = new Array(8)
    for (var i = 0; i < ban_ar.length; i++){
        ban_bak[i]=new Array(8)
    }
    for (var x = 0; x < 8; x++){
        for (var y = 0; y < 8; y++){
            ban_bak[x][y]=ban_ar[x][y]
        }
    }
    var line_reverse_cnt = 0
    var turn_flg = 0
    var xx = row_index
    var yy = cell_index
    //指定したセルから指定された方向へ移動
    //完了条件になるまで石を返す
    while (true){
        xx = xx + add_x
        yy = yy + add_y
        //盤の端」に到達したら抜ける
        if (xx < 0 || xx > 7 || yy < 0 || yy > 7) {
            break;
        }
        //移動先のセルに石がなかったら抜ける
        if (ban_ar[xx][yy] == 0) {
            break
        }
        //移動先のセルが自分自身であれば、石があった事を判断し抜ける
        if (ban_ar[xx][yy] == turn) {
            turn_flg = 1
            break;
        }
        //上記以外は相手の石であるので、裏返して裏返した件数の加算
        ban_ar[xx][yy] = turn
        line_reverse_cnt++
    }
    //裏返しを行ったが移動先に自分の石がなかった場合は元に戻す
    if (line_reverse_cnt > 0) {
        if (turn_flg == 0) {
            for (var i = 0; i < 8; i++){
                for (var ii = 0; ii < 8; ii++) {
                    ban_ar[i][ii] = ban_bak[i][ii]
                    line_reverse_cnt = 0
                }
            }
        } else {
            //ちゃんと裏返しが出来たら置いた所に自分の石を置く
            ban_ar[row_index][cell_index]=turn
        }
    }
    //最後に裏返しを行った件数を戻す
    return line_reverse_cnt
}


/*
追加実装文
*/


// 途中経過 pタグに表示
var white_cnt = 2
var black_cnt = 2
var star_cnt = 2
var progress = document.getElementById("progress")
progress.textContent = "白" + white_cnt + "黒" + black_cnt+"星"+star_cnt



// 途中経過をポップアップに表示
document.getElementById("btn_progress").onclick = function() {
    alert("白" + white_cnt + "黒" + black_cnt)
};

// 途中経過end