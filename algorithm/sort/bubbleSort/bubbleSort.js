function bubbleSort(array) {
	let count = 0;
	// 外循环控制总的循环次数
	for (let i = 0; i < array.length; i++) {
		count++;
		// 内循环进行比较交换，最右侧的元素已经有序不需要比较
		for (let j = 0; j < array.length - i - 1; j++) {
			// 相邻元素比较，交换
			if (array[j] > array[j + 1]) {
				const temp = array[j];
				array[j] = array[j + 1];
				array[j + 1] = temp;
			}
		}
	}
	console.log(count);
}

const array = [5, 8, 6, 3, 9, 2, 1, 7];

bubbleSort(array);

console.log(array);
