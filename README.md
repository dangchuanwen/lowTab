# lowTab
表格的基本操作，增，删，改，可以与后端交互，希望日益精进，以求进步

目录
     css
     html 
     js

css的文件夹下可定义表格的样式。

html 下 html.html 为 打开网页。

js 下的 sortTable.js 为主要操作。

下面为该js文件的主要函数说明：
        
     1.首先执行loadTable()函数，该函数为入口函数，里面执行的loadData()函数用于从后台加载数据，loadEvent()函数用于为表格绑定事件。
     2.需要注意的是加载的数据中需要一个数组，数组里面是需要进行排序的字段。
