(w=>{'use strict';

 //#Tester
	const test=(w=>{
		const console=w.console,
		JSON=w.JSON,
		parse=JSON.parse,
		stringify=JSON.stringify,
		pretty=x=>stringify(x,null,2),
		clean=(()=>{
			const a=/\\"/g,b=/"([^"]+)":/g,c=/\uFFFF/g;
			return s=>s?s.replace(a,'\uffff').replace(b,'$1:').replace(c,'\\"'):s
		})();
		let tests=0;
		return $=>{
			const source=$.source,
			goal=$.goal,
			expected=$.expected,
			a=$.a,
			b=$.b,
			tpl='source:%O,\u0020target:%O',
			goal_clone=(x=>{
				const s=stringify(x);
				return ()=>parse(s)
			})(goal),
			esegui=f=>{
				const target=goal_clone();
				//source.zz="copiedval";
				const v=f(target,source);
				//source.zz="linked!";//reference?
				return v
			},
			A=esegui(a),//result_1
			result1_stringifyed=stringify(A),
			B=esegui(b),//result_2
			result2_stringifyed=stringify(B),
			getFnName=(()=>{
				const p=/function\s*([^\(]+)/;
				return e=>{
					const s=(e.name && ['',e.name])||e.toString().match(p);
					return s&&s[1]||'anonymous';
				}
			})();
			source.__proto__=goal.__proto__=null;
			console.group(++tests,clean(result2_stringifyed)!==expected?'\u2718'+expected:'\u2713');
			//console.info(clean(result2_stringifyed));
			if(result1_stringifyed!==result2_stringifyed){
				const trace=(label,resultN)=>{
					console.group(label+':');
					console.log(pretty(resultN));
					console.groupEnd()
				};
				console.log(tpl,source,goal);
				trace(getFnName(b),B);
				trace(getFnName(a),A)
			}else{
				console.info(tpl+'\t( method1 achieves the same result as method2 )', source,goal);
				console.group(clean(result1_stringifyed));
				console.log(pretty(A));
				console.groupEnd()
			};
			console.groupEnd();
		}
	})(w);


 //#tests
	const tests_group1=[
		{
			source:{b:2},
			goal:{a:1},
			expected:'{a:1,b:2}',
		},
		{
			source:{a:0,b:2},
			goal:{a:1},
			expected:'{a:0,b:2}',
		},
		{
			source:{b:{c:2}},
			goal:{a:{c:1}},
			expected:'{a:{c:1},b:{c:2}}',
		},
		{
			source:{a:{c:1}},
			goal:{b:{c:2}},
			expected:'{b:{c:2},a:{c:1}}',
		},
		{
			source:{a:{c:1}},
			goal:{a:{c:2}},
			expected:'{a:{c:1}}',
		},
		{
			source:{a:[1,2,3]},
			goal:{a:[4,5,6]},
			expected:'{a:[1,2,3]}',
		}
	];
	const tests_group2=[
		{
			source:{
				a:{c:0,d:2},
				b:{c:2}
			},
			goal:{
				a:{c:1,d:1,e:3}
			},
			expected:'{a:{c:0,d:2,e:3},b:{c:2}}',
		},
		{
			source:{a:{a:1}},
			goal:{a:{b:1}},
			expected:'{a:{b:1,a:1}}',
		},
		{
			source:{
				b:{
					c:{
						d:{
							f:0
						}
					},
					d:{hallo:'ciao'},
					f:'yes'
				}
			},
			goal:{
				b:{
					c:{
						d:{
							e:12345,
							g:1
						}
					},
					d:'no'
				}
			},
			expected:'{b:{c:{d:{e:12345,g:1,f:0}},d:{hallo:"ciao"},f:"yes"}}',
		},
		/*
		{
			source:{},
			goal:{},
			expected:'',
		},
		*/
	];

	//#compare assign & deepAssign
	tests_group1.forEach((v,i,m)=>{
		v.a=Object.assign;
		v.b=deepAssign;
	});
	tests_group1.forEach(test);
	//#
	tests_group2.forEach((v,i,m)=>{
		v.a=Object.assign;
		v.b=deepAssign;
	});
	tests_group2.forEach(test);


	const simply=(a,b)=>{//target,source
		/*
		console.log(a,b)
		try{
			for(const [i,v] of b){
				a[i]=v
			}			
		}catch(err){
			console.warn(err)
		};
		*/
		for(const p in b){
			a[p]=b[p];
		};
		return a
	};
	//#compare assign & simply
	console.group('simply for-in');
	tests_group1.forEach((v,i,m)=>{
		v.a=Object.assign;
		v.b=simply;
	});
	tests_group1.forEach(test);
	console.groupEnd();
	
})(window);