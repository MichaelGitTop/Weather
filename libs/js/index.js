window.onload = function(){
	
	//删除市区字眼
	function correctCity( city ){
		if( city.charAt( city.length - 1 ) == '市' || city.charAt( city.length - 1 ) == '区' ){
			city = city.substring( 0, city.length - 1 );
		}
		return city;
	}
	
	//省级联动插件
	$(function(){
		$("#city").citySelect({
			nodata:"none",
			required:false
		}); 
	})
	
	//滚动时改变header透明度
	$( window ).scroll( function(){
		var opacity = 0;
		if( $( window ).scrollTop() < 200 ){
			var speed = $( window ).scrollTop() / 200;
			opacity += speed;
		}else{
			opacity = 1;
		}
		
		var opacity_cover = 0;
		if( $( window ).scrollTop() < 65 ){
			var speed = parseInt( $( window ).scrollTop()/10 ) / 10;
			opacity_cover = speed;
			$( '.backgroundPic img' ).attr( 'src', 'libs/img/bc.jpg' );
		}else{
			opacity_cover = 0.6;
			$( '.backgroundPic img' ).attr( 'src', 'libs/img/bc-c.jpg' );
		}
		
		$( 'header' ).css( 'background', 'rgba( 0, 0, 0, '+opacity+' )' );
		$( '.cover' ).css( 'opacity', opacity_cover );
		
	})
	
	//滑动显示左侧栏
	$( 'header i:first' ).on( 'touchstart', function( e ){
		e.preventDefault();
		$( '.left_bar' ).animate({
    		left: 0
    	});
	});
	$( '.m_container' ).on( 'touchstart', function( e ){
		if( $( '.left_bar' ).position().left >= 0 ){
			$( '.left_bar' ).animate({
		    		left: '-70%'
		    });
		}
	});
	$( '.m_container' ).touchwipe({
		min_move_x: 80,
        wipeLeft: function () { 
        	$( '.left_bar' ).animate({
        		left: '-70%'
        	});
        },
        wipeRight: function () { 
        	$( '.left_bar' ).animate({
        		left: 0
        	});
        },
        preventDefaultEvents: false
	})
	
	//左侧栏点击城市，显示天气
	$( '.left_bar td' ).on( 'touchstart', function(){
		var obj = $( this ).clone();
		obj.find(':nth-child(n)').remove();
		console.log( obj.text() );
		
		showWeather( obj.text() );
		//隐藏左侧栏
		$( '.left_bar' ).animate({
    		left: '-70%'
    	});
	})
	
	
	
	//自动滚动到可视内容
	var white_space = $( window ).height() - 361;
//	$( window ).on( 'touchend', function(){
//		var scroll = $( window ).scrollTop();
//		if( scroll >= 0 && scroll <= (53 + white_space/2) ){
//			console.log( 'up' );
//			$( window ).scrollTop( 0 );
////				scroll_position( 0 );
//		}
//	});
	$( window ).on( 'touchend', function(){
		var scroll = $( window ).scrollTop();
		console.log( scroll )
		if( scroll >= (53 + white_space/3) && scroll <= (53 + white_space) ){
			console.log( 'down' );
//			$( window ).scrollTop( 53 + white_space );
//				scroll_position( (53 + white_space) );
		}
	});
	
	$( window ).on( 'touchmove', function(){
		console.log( 'move' )
	})
	
	//滚动到某个位置的方法
	function scroll_position( target ){
		var timer = window.setInterval( function(){
			$( window ).scroll( function(){
				var scroll = $( window ).scrollTop();
				console.log( scroll );
				if( $( window ).on( 'touchmove') ){
					window.clearInterval( timer );
				}
				if( scroll > target ){
//					$( window ).scrollTop( scroll - 1  );
				}else{
					$( window ).scrollTop( scroll + 1  );
				}
			});
		}, 10);
	}
	
	//第一次显示广州的天气
	showWeather( '广州' );
	
	//阻止击穿footer
	$( 'footer' ).on( 'touchstart', function(){
		return false;
	});
	
	//底部点击功能
	$( 'footer li' ).on( 'touchstart', function(){
		console.log( $( this ).text() );
	});
				
	var searchBtn = document.getElementById("submit");
	var oInfo = document.getElementById("info");
	oInfo.style.display = "block";
	
	//用户填写城市，离开input后，返回天气
	$( '.search input' ).on( 'blur', function(){
		if( $( '.search input' ).val() != '' && /\S/gi.test( $( '.search input' ).val() ) ){
			var cityName = '广州';
			var searchTxt = document.getElementById("searchTxt").value;
			var selectTxt = $( '#city select:last' ).val();
			
			if( selectTxt == '' || selectTxt == null ){
				cityName = correctCity( searchTxt );
			}else{
				cityName = correctCity( selectTxt );
			}
			showWeather( cityName );
		}
	})
	
	//用户填写城市，按回车后，返回天气
	$( '.search input' ).on( 'keyup', function( e ){
		if( e.keyCode === 13 ){
			//让input失去焦点
			$( this ).blur();
			if( $( '.search input' ).val() != '' && /\S/gi.test( $( '.search input' ).val() ) ){
				var cityName = '广州';
				var searchTxt = document.getElementById("searchTxt").value;
				var selectTxt = $( '#city select:last' ).val();
				
				if( selectTxt == '' || selectTxt == null ){
					cityName = correctCity( searchTxt );
				}else{
					cityName = correctCity( selectTxt );
				}
				showWeather( cityName );
			}
		}
	});
	
	//显示天气
	function  showWeather( cityName ){
		var weather = new Weather();
		weather.ajax( "get", "http://wthrcdn.etouch.cn/weather_mini?city=" + cityName , callBack );
		
		//ajax请求回调函数
		function callBack( arr ){
			if( arr.desc == "OK" && arr.status == 1000 ){
				oInfo.style.display = "block";
				oInfo.innerHTML = "";
				cleanupArr( arr );
			}else{
				document.getElementsByClassName('tip')[0].innerHTML = "您输入的城市有误，请重新输入，谢谢！";
				document.getElementsByClassName('tip')[0].style.color = "#d64f44";
			}
		}
		
		//请求得到的数据进行处理
		function cleanupArr( arr ){
			
			//天气封面数据处理
			var now_obj = arr.data.forecast;
			var face_html = '<div class="main"> <div class="issue_time"><span>刚刚</span>发布</div> <div class="white_space"></div> <p class="w_type">' 
			+ now_obj[0]["type"] + '</p> <p class="w_temp">' 
			+ arr.data.wendu + '°</p> <p class="w_wind"><i class="fa fa-paper-plane"></i>&nbsp;&nbsp;' 
			+ now_obj[0]["fengxiang"] + '&nbsp;' + now_obj[0]["fengli"] + '</p> </div> <div class="forecast"> <div class="line"></div> <div class="today block fl"> <p><span class="fl">今天</span><span class="fr">最低&nbsp;<i>' 
			+ now_obj[0]["low"].replace(/[^0-9-]/gi, "") + '°C</i></span></p> <p class="">' 
			+ now_obj[0]["type"] + '</p> <img src="libs/img/' 
			+ weather_type_pic( now_obj[0]["type"] ) + '.png"/> </div> <div class="line_up fl"></div> <div class="tomorrow block fr"> <p><span class="fl">明天</span><span class="fr">' 
			+ now_obj[1]["high"].replace(/[^0-9-]/gi, "") + '/' 
			+ now_obj[1]["low"].replace(/[^0-9-]/gi, "") + '°C</span></p> <p>' 
			+ now_obj[1]["type"] + '</p> <img src="libs/img/' 
			+ weather_type_pic( now_obj[1]["type"] ) + '.png"/> </div> <div class="line"></div> </div>';
			$( '.m_container .main' ).remove();
			$( '.m_container .forecast' ).remove();
			$( '.m_container .search' ).after( face_html );
			
			$('.m_container .tip').css( 'color', '#FFF' );
			$('.m_container .tip').html( arr.data.ganmao );
			
			var yestDate = arr.data.yesterday;
			
			var type = yestDate["type"];
			var typePic = weather_type_pic( type );
						
			var yes_html = '<li style="opacity: 0.6"> <p>昨天</p> <p>10/' 
					+ yestDate["date"].replace(/[^0-9]/gi, "") + '</p> <p>' 
					+ type + '</p> <img src="libs/img/' 
					+ typePic + '.png"> <p class="m10">高温 ' 
					+ yestDate["high"].replace(/[^0-9-]/gi, "")  + '℃</p> <p class="m10">低温 ' 
					+ yestDate["low"].replace(/[^0-9-]/gi, "")  + '℃</p> <p class="m10 h20">' 
					+ yestDate["fl"]  + '</p> <p class="backgroud">' 
					+ yestDate["fx"]  + '</p> </li> <div class="line_up fl"></div>';
			
			$( '#info' ).append( yes_html );
			
			var currDate = arr.data.forecast;
			for( var i=0; i<currDate.length; i++ ){
				
				var type = currDate[i]["type"];
				var typePic = weather_type_pic( type );
					
				var _html = '<li class=""> <p>周' 
					+ lastChar(currDate[i]["date"]) + '</p> <p>10/'
					+ currDate[i]["date"].replace(/[^0-9]/gi, "") + '</p> <p>' 
					+ type + '</p> <img src="libs/img/' 
					+ typePic + '.png"> <p class="m10">高温 ' 
					+ currDate[i]["high"].replace(/[^0-9-]/gi, "")  + '℃</p> <p class="m10">低温 ' 
					+ currDate[i]["low"].replace(/[^0-9-]/gi, "")  + '℃</p> <p class="m10 h20">' 
					+ currDate[i]["fengli"]  + '</p> <p class="backgroud">' 
					+ currDate[i]["fengxiang"]  + '</p> </li> <div class="line_up fl"></div>';
				
				$( '#info' ).append( _html );
			}
			
			//修改预报ul块的width
			$( '.w_forecast ul' ).width( 365 );
			
			//修改定位城市
			$( 'header i:eq(1) span' ).text( cityName );
			
			//控制首页空白部分的高度，根据手机尺寸自动调整(已经背景图片的大小)
			$( '.m_container .white_space' ).height( $( window ).height()-361 );
			$( '.backgroundPic img' ).css( 'width', $( window ).width() );
			$( window ).resize( function(){
				$( '.m_container .white_space' ).height( $( window ).height()-361 );
				$( '.backgroundPic img' ).css( 'width', $( window ).width() );
			})
			
		}
		
	}
	
	
	//返回字符串中的最后一个字符
	function lastChar( arr ){
		return arr.charAt( arr.length-1 );
	}
	
	//根据天气类型，匹配对应图片的方法
	function weather_type_pic( type ){
		var typePic = 0;
		switch( type ){
			case "晴": typePic = 1; break;
			case "小雨": typePic = 8; break;
			case "中雨": typePic = 9; break;
			case "多云": typePic = 'icon-512px/weather_duoyun'; break;
			case "阴": typePic = 'icon-512px/weather_yin'; break;
			case "大雨": typePic = 'icon-512px/weather_dayu'; break;
			case "阵雨": typePic = 'icon-512px/weather_zhenyu'; break;
			case "冻雨": typePic = 'icon-512px/weather_dongyu'; break;
			case "中到大雨": typePic = 'icon-512px/weather_dayu'; break;
			case "暴雨": typePic = 'icon-512px/weather_baoyu'; break;
			case "大暴雨": typePic = 'icon-512px/weather_dabaoyu'; break;
			case "特大暴雨": typePic = 'icon-512px/weather_tedabaoyu'; break;
			case "雷阵雨": typePic = 'icon-512px/weather_leizhenyu'; break;
			case "雷阵雨伴有冰雹": typePic = 'icon-512px/weather_leizhenyubanyoubingbao'; break;
			case "雨夹雪": typePic = 'icon-512px/weather_yujiaxue'; break;
			case "小雪": typePic = 'icon-512px/weather_xiaoxue'; break;
			case "中雪": typePic = 'icon-512px/weather_zhongxue'; break;
			case "大雪": typePic = 'icon-512px/weather_daxue'; break;
			case "暴雪": typePic = 'icon-512px/weather_baoxue'; break;
			case "阵雪": typePic = 'icon-512px/weather_zhenxue'; break;
			case "霾": typePic = 'icon-512px/weather_mai'; break;
			case "雾": typePic = 'icon-512px/weather_wu'; break;
			case "扬沙": typePic = 'icon-512px/weather_yangsha'; break;
			case "沙尘暴": typePic = 'icon-512px/weather_shachenbao'; break;
			default: console.log( '找不到对应天气类型的图片：' + type )
		}
		return typePic;
	}
	
	function Weather(){
		
		this.creatXHR = function(){
			if( window.XMLHttpRequest ){
				return new window.XMLHttpRequest;
			}else{
				return new ActiveXObject( "Microsoft.XMLHTTP" );
			}
		}
		
		this.ajax = function( post, url, fun ){
			var xhr = this.creatXHR();
			console.log( url );
			
			xhr.open( post, url, true );
			
			xhr.send( null );
			
			xhr.onreadystatechange = function(){
				
				if( xhr.readyState == 4 && xhr.status == 200 ){
					var json = xhr.responseText;
					
					fun( JSON.parse( json ) );
				}
			}
		}
		
	}
	
	//刷新页面
	$( 'footer li:first i' ).on('touchstart', function(){
		window.location.href = "index.html";
	})
	
	//点击时景、我、分享，显示“敬请期待”
	$( 'footer li:gt(0)' ).on('touchstart', function(){
		console.log( $( this ) );
		layer.msg('功能尚未开放，敬请期待！', {
			offset: '30%',
			time: 5000,
			shift: 1,
			btn: '好'
		});
	})
	$( 'header i:last' ).on('touchstart', function(){
		layer.msg('功能尚未开放，敬请期待！', {
			offset: '30%',
			time: 5000,
			shift: 1,
			btn: '好'
		});
	})
	$( '.left_bar tr:first' ).on('touchstart', function(){
		layer.msg('功能尚未开放，敬请期待！', {
			offset: '30%',
			time: 5000,
			shift: 1,
			btn: '好'
		});
	})
}