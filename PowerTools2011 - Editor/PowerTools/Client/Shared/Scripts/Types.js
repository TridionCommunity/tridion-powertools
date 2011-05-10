
///
/// do a Deep clone of the object into a new instance
/// (tried adding 'deepClone' to Object.prototye but GUI threw a bunch of errors)
Object.deepCopy = function (existing)
{
	var newObj = (existing instanceof Array) ? [] : {};

	for (i in existing)
	{
		if (i == "deepClone") continue;

		if (existing[i] && typeof existing[i] == "object")
		{
			newObj[i] = Object.deepCopy(existing[i]); //.deepClone();
		}
		else
		{
			newObj[i] = existing[i];
		}
	}

	return newObj;
};