function insertSort(array) {
	// 默认第一个元素是有序区域，所以无序区域从第二个元素开始遍历
	for (let i = 1; i < array.length; i++) {
		// 插入的值 暂时存起来
		const insertValue = array[i];
		// 有序区域是i的前面
		let j = i - 1;
		for (; j >= 0 && insertValue < array[j]; j--) {
			// 如果插入值比其他值都小则进行复制
			array[j + 1] = array[j];
		}
		// 在合适位置插入
		array[j + 1] = insertValue;
	}
}
const array = [12, 1, 3, 46, 5, 0, -3, 12, 35, 16];

insertSort(array);

console.log(array);
