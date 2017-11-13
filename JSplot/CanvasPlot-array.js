function plotInCanvas(data,str){
	//data<-two dimensional array [[x,y]]
	//str<- equation: a*sin(x) or sin(x)
	//min-height:300px
	//min-width:360px
	//high resolution is strongly recommended
	//display with too small size will let line go out of boundary
	var container = $("#plot");
	var canvas = container.children("canvas")[0];
	//self-adaptive
	canvas.width = container.width();
	canvas.height = container.height();
	//inside margin parameter
	var margin = 30;
	
	absmax = 0;
	for(var i=0;i<data.length;i++)
		if(absmax<Math.abs(data[i][1]))
			absmax = Math.abs(data[i][1]);
	//quater points without scaling
	var quater = [[0,0],[0,0]];
	for(var i=0,j=0;i<data.length&&j<2;i++){
		if(Math.abs(data[i][1])==absmax){
			quater[j][0]=data[i][0];
			quater[j][1]=-data[i][1];
			j++;
		}
	}
	
	if(quater[0][1]==0&&quater[1][1]==0){
		//0*sin(x)
		//manually set quater point
		quater[0][0] = data[Math.floor(data.length/4)][0];
		quater[1][0] = data[Math.floor(data.length/4*3)][0];
		quater[0][1] = -0.001;
		quater[1][1] = -quater[0][1];
	}
	
	//scale parameter
	var width_scale = canvas.width/Math.abs(quater[0][0]-quater[1][0])*0.4;
	var height_scale = canvas.height/Math.abs(quater[0][1]-quater[1][1])*0.7;
	//update with scaling
	quater[0][0] *= width_scale;
	quater[1][0] *= width_scale;
	quater[0][1] *= height_scale;
	quater[1][1] *= height_scale;
	//first point
	var first = [data[0][0]*width_scale,data[0][1]*height_scale];
	//middle point [0,0]
	var middle = [data[Math.floor(data.length/2)][0]*width_scale,data[Math.floor(data.length/2)][1]*height_scale];
	//last point
	var last = [data[data.length-1][0]*width_scale,data[data.length-1][1]*height_scale];
	
	var ctx=canvas.getContext("2d");
	
	//border
	ctx.rect(0,0,canvas.width,canvas.height);
	ctx.stroke();
	ctx.rect(margin,margin,canvas.width-margin*2,canvas.height-margin*2);
	ctx.stroke();
	//coordinate translation
	ctx.translate(canvas.width/2,canvas.height/2);

	//font setting
	ctx.font="10px Georgia";
	//title
	ctx.fillText(str,-ctx.measureText(str).width/2,-canvas.height/2+margin-8);
	//setting number for x-axis
	var label = Math.round(first[0]/width_scale*1000)/1000;//keep three digits after dot
	ctx.beginPath();
	ctx.moveTo(first[0],canvas.height/2-margin);
	ctx.lineTo(first[0],canvas.height/2-margin-10);
	ctx.stroke();
	ctx.fillText(label,first[0]-ctx.measureText(label).width/2,canvas.height/2-margin+12);
	
	label = Math.round(quater[0][0]/width_scale*1000)/1000;//keep three digits after dot
	ctx.beginPath();
	ctx.moveTo(quater[0][0],canvas.height/2-margin);
	ctx.lineTo(quater[0][0],canvas.height/2-margin-5);
	ctx.stroke();
	ctx.fillText(label,quater[0][0]-ctx.measureText(label).width/2,canvas.height/2-margin+12);
	
	label = Math.round(middle[0]/width_scale*1000)/1000;//keep three digits after dot
	ctx.beginPath();
	ctx.moveTo(0,canvas.height/2-margin);
	ctx.lineTo(0,canvas.height/2-margin-10);
	ctx.stroke();
	ctx.fillText(label,-ctx.measureText(label).width/2,canvas.height/2-margin+12);
	ctx.fillText("X",-ctx.measureText("X").width/2,canvas.height/2-5);
	
	label = Math.round(quater[1][0]/width_scale*1000)/1000;//keep three digits after dot
	ctx.beginPath();
	ctx.moveTo(quater[1][0],canvas.height/2-margin);
	ctx.lineTo(quater[1][0],canvas.height/2-margin-5);
	ctx.stroke();
	ctx.fillText(label,quater[1][0]-ctx.measureText(label).width/2,canvas.height/2-margin+12);
	
	label = Math.round(last[0]/width_scale*1000)/1000;//keep three digits after dot
	ctx.beginPath();
	ctx.moveTo(last[0],canvas.height/2-margin);
	ctx.lineTo(last[0],canvas.height/2-margin-10);
	ctx.stroke();
	ctx.fillText(label,last[0]-ctx.measureText(label).width/2,canvas.height/2-margin+12);
	
	//setting number for y-axis
	label = Math.round(-quater[0][1]/height_scale*1000)/1000;//keep three digits after dot
	ctx.beginPath();
	ctx.moveTo(-canvas.width/2+margin,quater[0][1]);
	ctx.lineTo(-canvas.width/2+margin+10,quater[0][1]);
	ctx.stroke();
	ctx.rotate(-Math.PI/2);
	ctx.fillText(label,-quater[0][1]-ctx.measureText(label).width/2,-canvas.width/2+margin-5);
	//ctx.fillText(label,-canvas.width/2+margin-ctx.measureText(label).width-5,quater[0][1]+3);
	ctx.rotate(Math.PI/2);
	
	label = Math.round(middle[1]/width_scale*1000)/1000;//keep three digits after dot
	ctx.beginPath();
	ctx.moveTo(-canvas.width/2+margin,0);
	ctx.lineTo(-canvas.width/2+margin+10,0);
	ctx.stroke();
	ctx.rotate(-Math.PI/2);
	ctx.fillText(label,-ctx.measureText(label).width/2,-canvas.width/2+margin-5);
	ctx.fillText("Y",-ctx.measureText("Y").width/2,-canvas.width/2+15);
	ctx.rotate(Math.PI/2);
	
	label = Math.round(-quater[1][1]/height_scale*1000)/1000;//keep three digits after dot
	ctx.beginPath();
	ctx.moveTo(-canvas.width/2+margin,quater[1][1]);
	ctx.lineTo(-canvas.width/2+margin+10,quater[1][1]);
	ctx.stroke();
	ctx.rotate(-Math.PI/2);
	ctx.fillText(label,-quater[1][1]-ctx.measureText(label).width/2,-canvas.width/2+margin-5);
	ctx.rotate(Math.PI/2);
	
	//plot with scaling
	ctx.beginPath();
	ctx.moveTo(data[0][0]*width_scale,-data[0][1]*height_scale);
	for(var i=1;i<data.length;i++)
		ctx.lineTo(data[i][0]*width_scale,-data[i][1]*height_scale);
	ctx.stroke();
}