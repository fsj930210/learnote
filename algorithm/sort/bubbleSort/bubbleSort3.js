function bubbleSort(array) {
	let count = 0;
	// 记录最后一次交换的索引
	let lastExchangeIndex = 0;
	// 无序数列的边界，每次比较只需要比到这里为止
	let sortBorder = array.length - 1;
	// 外循环控制总的循环次数
	for (let i = 0; i < array.length; i++) {
		count++;
		// 默认就是有序的
		let isSorted = true;
		// 内循环进行比较交换，最右侧的元素已经有序不需要比较
		for (let j = 0; j < sortBorder; j++) {
			// 相邻元素比较，交换
			if (array[j] > array[j + 1]) {
				const temp = array[j];
				array[j] = array[j + 1];
				array[j + 1] = temp;
				// 有交换则证明无序
				isSorted = false;
				// 把无序数列的边界更新为最后一次交换元素的位置
				lastExchangeIndex = j;
			}
		}
		// 跟新无序数据的边界位置
		sortBorder = lastExchangeIndex;
		// 如果有序退出循环
		if (isSorted) {
			break;
		}
	}
	console.log(count);
}

const array = [3, 4, 2, 1, 5, 6, 7, 8];

bubbleSort(array);

console.log(array);
