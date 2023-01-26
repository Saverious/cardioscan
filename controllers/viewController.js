exports.dash=(req,res,next)=>{
    res.render('main/index',{
        title:'Dashboard'
    });
}

exports.charts=(req,res,next)=>{
    res.render('main/charts',{
        title:'Charts'
    });
}

exports.tables=(req,res,next)=>{
    res.render('main/tables',{
        title:'My records'
    });
}