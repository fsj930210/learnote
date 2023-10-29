function selectionSort(array) {
	for (let i = 0; i < array.length; i++) {
		// 默认最小值是当前外循环的值
		let minIndex = i;
		// 内循环从外循环当前值开始循环，因为i前面的都已经有序
		for (let j = i; j < array.length; j++) {
			// 找出最小值
			minIndex = array[minIndex] < array[j] ? minIndex : j;
		}
		// 交换
		const temp = array[i];
		array[i] = array[minIndex];
		array[minIndex] = temp;
	}
}

const array = [3, 4, 2, 1, 5, 6, 7, 8, 30, 50, 1, 33, 24, 5, -4, 7, 0];

selectionSort(array);

console.log(array);
