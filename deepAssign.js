const deepAssign=(global=>{
	const O=global.Object,
	isO=o=>o instanceof O;
	return O.defineProperty((a,b)=>{
		const f=isO;
		if(f(b)){
			const g=deepAssign;
			for(const [i,v] of O.entries(b)){
				const e=a[i];
				a[i]=(f(e)&&f(v))?g(e,v):v
			}
		};
		return a
	},'name',{
		value:'deepAssign'
	});
})(window);