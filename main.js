var PUBNUB_obj = PUBNUB.init({
	publish_key: 'pub-c-bb648182-1ad2-4af1-93c9-8f33b703ba1d',
	subscribe_key: 'sub-c-2b943f26-a2b6-11e4-83f5-02ee2ddab7fe'
});

var lastSender="";

function getNewRow(m, lastSender){
	if(m.username==lastSender){
		return "<tr><td class='username'></td><td class='message'>" + m.message + "</tr>"
	}
	var row = "<tr><td class='username'>"+m.username + ":</td><td class='message'>" + m.message + "</tr>"
	return row;
}

//Subscribe to the demo_tutorial channel
PUBNUB_obj.subscribe({
	channel: 'tex_talk',
	message: function(m){
		newRow = getNewRow(m,lastSender);
		document.getElementById("chat-table").innerHTML += newRow;
		lastSender=m.username;
		
		var chatLog = $("#chat-log");
		chatLog.animate({ scrollTop: chatLog.prop("scrollHeight") - chatLog.height()+20 }, 500);
	}
});


var is_matched = false;
function formatText(text){
	text = text.replace(/\n/g, "<br/>");
	var textArea = document.getElementById("message");
	var re = /\\begin{equation}(\n*.*)*\\end{equation}/g;
	while ((match = re.exec(text)) != null) {
		is_matched=true;
		var matched = match[0];
		if (typeof match[1] != 'undefined'){
			var latex = match[1].replace(/<br\/>/g, ""); //Get rid of new lines.
			latex = encodeURIComponent(latex);
			if (match.index<=2){
				text = text.replace(matched, "<img class='tex' src='http://latex.codecogs.com/png.latex?"+latex+"' />");
			}
    		else {
    			text =text.replace(matched, "<img class='tex' src='http://latex.codecogs.com/png.latex?"+latex+"' />");
    		}
    		textArea.value=match[0].replace(/<br\/>/g, "\n");
    	}
	}
	return text;
}

function addTeX(){
	var tex = "\\begin{equation}\n\n\\end{equation}";
	var input = document.getElementById('message');
    input.value = (input.value + tex);
}

function doSend(){
	user=formatText(document.getElementById("username").value);
	if (user=="") user="Unknown";
	text=formatText(document.getElementById("message").value);
	
	
	PUBNUB_obj.publish({
	   channel: 'tex_talk',
	   message: {"username":user,"message":text}
	});
	
	if (!is_matched){ document.getElementById("message").value=""; } 
	else { is_matched=false; }
	var textArea = document.getElementById("message");
	textArea.focus();
	textArea.select();
}