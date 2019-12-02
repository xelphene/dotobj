
'use strict';

/** 

<p>expand takes an object which has properties with names possibly
containing dots (or sepChar) and turns the dot-separated parts into
sub-objects, recursively. Perhaps an example better explains this:</p>

<pre><code>
expand({
	'a.x': 1,
	'a.y': 2,
	b:   3,
	a:   9
})
</code></pre>

<p>returns:</p>

<pre><code>
{
	a: {
		x: 1,
		y: 2
		'': 9
	},
	b: 3
}
</code></pre>

<p>The separator character ('.' in the example above) is specified with sepChar
and defaults to a '.'.</p>

<p>Notice in the above example that the property a is ambiguously both an
object (containing x, y properties) and the number 9.  When this situation
is encountered, the existing primitive value will be moved to the property
named by the defaultKey parameter, which is '' by default.</p>

*/

function expand(o, sepChar, defaultKey)
{
	if( defaultKey===undefined ) {
		defaultKey='';
	}
	if( sepChar===undefined ) {
		sepChar='.';
	}
	
	// generate a (possibly) new key to which this value will be assigned
	// deconstructs names with dots and transforms values into objects
	function rename(k,v) {
		if( k.includes(sepChar) ) {
			var newKey = k.split(sepChar)[0];
			var newValue = {};
			newValue[k.substr(k.indexOf(sepChar)+1)] = o[k];
		} else {
			var newKey = k;
			var newValue = o[k];
		}
		return [newKey, newValue];
	}

	/*
	Assign the value v to object o as property k.
	In otherwords, do o[k]=v. However, if there already is an o.k and it is an
	object and v is an object, then v will be merged into o.k with Object.assign.
	If o.k is an ordinary value, o.k will be replaced with an object with the old 
	value at o.k[defualtKey]. This might happen if o looks something like this, 
	for example:
		expand({
			'key': 123,
			'key.sub': 456
		})
	will return:
		{
			'key': {
				'': 123,
				'sub': 456
			}
		}
	*/
	
	function isRecursibleObject(o)
	{
		// originally we did this, but this will recurse into (and expand)
		// objects built with constructors, which we usually don't want.
		//return typeof(o) == 'object' && ! Array.isArray(o);

		return typeof(o) == 'object' && ! Array.isArray(o) && o.constructor==Object;
	}
	
	function assign(o, k, v)
	{
		if( o.hasOwnProperty(k) ) {
			if( typeof(o[k]) != 'object' ) {
				let oldValue = o[k];
				o[k] = {};
				o[k][defaultKey] = oldValue;
			}
			
			if( typeof(v)=='object' ) {
				Object.assign(o[k], v);
			} else {
				// overwrite old value
				o[k][defaultKey] = v;
			}
		} else {
			o[k] = v;
		}
		return o;
	}
	
	var o2 = {};
	Object.keys(o).sort().forEach( k => {
		var [newKey, newValue] = rename(k, o[k]);
		//console.log(k+' -> '+newKey+' = '+JSON.stringify(newValue));
		o2 = assign(o2, newKey, newValue);
	});	
	
	// do this recursively on all member objects
	Object.keys(o2).forEach( k => {
		//if( typeof(o2[k]) == 'object' && ! Array.isArray(o2[k]) ) {
		if( isRecursibleObject(o2[k]) ) {
			o2[k] = expand(o2[k], sepChar, defaultKey);
		}
	});
	
	return o2;
}

/**

<p>collapse does the inverse of expand. Example:</p>

<pre><code>
collapse({
    a: {
        x: 1,
        y: 2
    },
    b: 3,
    a: 9
})
</code></pre>

<p>returns:</p>

<pre><code>
{
    'a.x': 1,
    'a.y': 2,
    b: 3,
    a: 9
}
</code></pre>
*/

function collapse(o, sepChar)
{
	if( sepChar===undefined ) {
		sepChar='.';
	}
	var o2 = {};
	Object.keys(o).forEach( k => {
		if( typeof(o[k]) == 'object' && ! Array.isArray(o[k]) ) {
			var nv = collapse(o[k], sepChar);
			Object.keys(nv).forEach( k2 => {
				if( k2 != '' ) {
					o2[k+sepChar+k2] = nv[k2];
				} else {
					o2[k] = nv[k2];
				}
			});
		} else {
			o2[k] = o[k];
		}
	});
	return o2;
}

exports.expand = expand;
exports.collapse = collapse;
