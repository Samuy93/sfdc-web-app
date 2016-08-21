
app = (function(){

	var factory = {};

	factory.log =  function (msj){
		console.log('>>> DEBUG LOG ',msj);
	};

	return factory;
})();