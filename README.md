
# dotobj

dotobj is a package of two Javascript functions which will expand key/value
structures with dots (or any other character) in the key names into nested
objects.

# Examples

```
const expand = require('dotobj').expand;
expand({
	'a.x': 1,
	'a.y': 2,
	b:   3,
	a:   9
})
```

Returns:

```
{
	a: {
		x: 1,
		y: 2
		'': 9
	},
	b: 3
}
```

And the inverse:

```
const collapse = require('dotobj').collapse;
collapse({
    a: {
        x: 1,
        y: 2
    },
    b: 3,
    a: 9
})
```

Returns:

```
{
    'a.x': 1,
    'a.y': 2,
    b: 3,
    a: 9
}
```

# Copyright and License

Copyright (C) 2019 Steve Benson

dotobj was written by Steve Benson.

dotobj is free software; you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free
Software Foundation; either version 3, or (at your option) any later
version.

dotobj is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more
details.

You should have received a copy of the GNU General Public License along with
this program; see the file LICENSE.  If not, see <http://www.gnu.org/licenses/>.
