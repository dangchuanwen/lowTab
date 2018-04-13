
function loadData(){                                     //后台加载数据
    var all_info=[
        { id:'20162203491',name:'党传文',chinese:98,math:95,english:80 },
        { id:'20162203492',name:'王尼玛',chinese:95,math:90,english:75 },
        { id:'20162203493',name:'张尼玛',chinese:90,math:88,english:70 }
    ];
    var rows=[];
    for(var i=0,len=all_info.length;i<len;i++){
        var one={};
        var tr=document.createElement("tr");
        var btnFLag=1;
        var btn1;
        var btn2;
        btn2=cancelBtn();
        for(var j in all_info[i]){
            if(!all_info[i][j]){
                btnFLag=0;
            }
            var td=document.createElement("td");
            td.innerHTML=all_info[i][j];
            tr.appendChild(td);
        }
        if(btnFLag){
            btn1=changeBtn();
        }
        else {
            btn1=confirmBtn();
        }
        var td=document.createElement("td");
        td.appendChild(btn1);
        td.appendChild(btn2);
        tr.appendChild(td);
        one['head']=tr;
        rows.push(one);
    }
    updateTab(rows);
}

function ajaxData(e,Type){                               //Ajax 请求 修改后端数据
    console.log("Ajax请求后端并更新数据库数据",e);
}
function cancelAdd(e){                               //删除行
    var tr=e.parentNode.parentNode;
    var tds=tr.getElementsByTagName("td");
    var primaryKey;
    if(tds[0].firstChild.nodeType==3){
        primaryKey=tds[0].innerHTML;
        primaryKey=primaryKey.replace(" ","");
        ajaxData(primaryKey,'delete');
    }
    tr.parentNode.removeChild(tr);
    console.log("删除行");
}
function confirmAdd(e){                             //确定添加
    var tr=e.parentNode.parentNode;
    var tds=tr.getElementsByTagName("td");
    var inputNum=0;
    var sendData={};
    var keys=[];
    var thead=document.getElementById("column_num");
    var theadTd=document.getElementsByTagName("th");
    for(var i=0,len=theadTd.length-1;i<len;i++){
       var inner=theadTd[i].innerHTML;
        var index=inner.indexOf("<");
        if(index!=-1) inner=inner.slice(0,index);
        inner=inner.replace(" ","");
        keys.push(inner);
    }
    for(var i=0,len=tds.length-1;i<len;i++){            //判断 是否填写,填写的 用 文本节点替换
        var text=tds[i].firstChild.value;
        if(text){
            var textNode=document.createTextNode(text);
            tds[i].removeChild(tds[i].firstChild);
            tds[i].appendChild(textNode);
            sendData[keys[i]]=text;
        }
    }

    for(var i=0,len=tds.length;i<len;i++){              //判断 未填写的 次数
        var child=tds[i].firstChild;
        if( child.nodeType==3 ){
            inputNum ++;
            
        }
    }
    if( inputNum == tds.length-1 ){
        e.innerHTML="修改";
        e.setAttribute("class",e.getAttribute("class").replace("btn-add","btn-change"));
        e.onclick=function(){
            changeRow(e);
        }
    }

    ajaxData(sendData,"update");
    
}
function confirmBtn(){
  
    var addButton=document.createElement("button");
    addButton.setAttribute("class","btn btn-add sm");
    addButton.innerHTML="确定";
    addButton.onclick=function(){
        confirmAdd(this);
    }
    return addButton;
}
function cancelBtn(){
   
    var deleteButton=document.createElement("button");
    deleteButton.setAttribute("class","btn btn-delete sm");
    deleteButton.innerHTML="删除";
    deleteButton.onclick=function(){
        cancelAdd(this);
    }
    return deleteButton;
}
function changeBtn(){
    var addButton=document.createElement("button");
    addButton.setAttribute("class","btn btn-change sm");
    addButton.innerHTML="修改";
    addButton.onclick=function(){
        changeRow(this);
    }
    return addButton;
}
function updateTab(datas){                              //更新加载表格
    var tbody=document.getElementById("tbody");
    tbody.innerHTML="";
    for(var i=0,len=datas.length;i<len;i++){
        tbody.appendChild(datas[i].head);
    }
}
function changeRow(e){                              //修改行

    var tr=e.parentNode.parentNode;
    var tds=tr.getElementsByTagName("td");
    for(var i=0,len=tds.length-1;i<len;i++){
       var value=tds[i].innerHTML;
       var input=document.createElement("input");
       input.value=value;
       tds[i].removeChild(tds[i].firstChild);
       tds[i].appendChild(input);
    }
    e.innerHTML="确定";
    e.setAttribute("class",e.getAttribute("class").replace("btn-change","btn-add"));
    e.onclick=function(){
        confirmAdd(this);
    }
    console.log('改变行信息');

}
function addRow(){                                    //添加行
    console.log("添加行");
    var tbody=document.getElementById("tbody");
    var tr=document.createElement("tr");
    var num=document.getElementById("column_num").getElementsByTagName("th").length;
    var lastTd=document.createElement("td");
    lastTd.appendChild(confirmBtn());
    lastTd.appendChild(cancelBtn());
    
    for(var i=0,len=num;i<len-1;i++){
        var input=document.createElement("input");
        input.setAttribute("type","text");
        var td=document.createElement("td");
        td.appendChild(input);
        tr.appendChild(td);
    }
    tr.appendChild(lastTd);
    tbody.appendChild(tr);
}
function removeAll(){
    var tbody=document.getElementById("tbody");
    tbody.innerHTML="";
}
function bindSort(){                                        //绑定排序
    var column_num=document.getElementById("column_num");
    var ths=column_num.getElementsByTagName("th");
   
    for(var i=0,len=ths.length;i<len;i++){
        if(ths[i].innerHTML.indexOf("<b")!=-1){
           for(var j=0;j<ths[i].children.length;j++){

               if(ths[i].children[j].getAttribute("class")=='asc'){
                ths[i].children[j].onclick=function(){
                    sortAsc(this);
                }
               }
               else {
                   ths[i].children[j].onclick=function(){
                       sortDesc(this);
                   }
               }

           }
        }
    }
}
function sortTable(key,Type){                           //传入 字段名 以及 排序类型
        var allRow=[];
       
        var column_num=document.getElementById("column_num");
        var ths=column_num.getElementsByTagName("th");
        var tbody=document.getElementById("tbody");
        var trs=tbody.getElementsByTagName("tr");
        var index;
        var flag;
        if(Type === 'asc'){
             flag =-1;
        }
        else {
            flag=1;
        }
        for(var i=0,len=ths.length;i<len;i++){
            if(ths[i].innerHTML.slice(0,ths[i].innerHTML.indexOf("<b")).replace(" ","")==key){
                break;
            }
        }
        index=i;
        for(var i=0,len=trs.length;i<len;i++){     
            if(trs[i].getElementsByTagName("td")[index].firstChild.nodeType==3){       //判断是否是文本节点
            var one={};
            one["head"]=trs[i];
            one["grade"]=Number(trs[i].getElementsByTagName("td")[index].innerHTML);
            allRow.push(one);
            }
        }
        
        if(allRow.length>=2){
            allRow.sort(function(x,y){
                if(x.grade<y.grade) return flag;
                else return -flag;
            })
        }
        updateTab(allRow);
        

}
function sortAsc(e){                                     //升序
        var parent=e.parentNode;
        var inner=parent.innerHTML;
        inner=inner.slice(0,inner.indexOf("<b")).replace(" ","");
        sortTable(inner,'asc');
}
function sortDesc(e){                                   //降序
    var parent=e.parentNode;
    var inner=parent.innerHTML;
    inner=inner.slice(0,inner.indexOf("<b")).replace(" ","");
    sortTable(inner,'desc');
}
function loadEvent(){
    var add_row=document.getElementById("add_row");
    var rm_all_row=document.getElementById("rm_all_row");
    bindSort();
    add_row.onclick=addRow;
    rm_all_row.onclick=removeAll;
    
}
function loadTable(){
    loadData();                      //后端加载数据
    loadEvent();                    //添加事件（增加，删除，全部删除，升序，降序）
    
}
loadTable();






