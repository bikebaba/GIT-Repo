/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports.new = function(req, res){
    
    res.send("<form method='post' action='/articles'>\
                <input type='text' placeholder='name'/>\
                </form>");
}