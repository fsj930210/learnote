function bubbleSort(array) {
	let count = 0;
	// 记录最后一次交换的索引
	let lastLeftExchangeIndex = 0;
	// 无序数列的边界，每次比较只需要比到这里为止
	let leftSortBorder = 0;
	let lastRightExchangeIndex = 0;
	let rightSortBorder = array.length - 1;
	// 外循环控制总的循环次数
	for (let i = 0; i < array.length / 2; i++) {
		count++;
		// 默认就是有序的
		let isSorted = true;
		// 奇数轮 从左向向右遍历
		for (let j = leftSortBorder; j < rightSortBorder; j++) {
			// 相邻元素比较，交换
			if (array[j] > array[j + 1]) {
				const temp = array[j];
				array[j] = array[j + 1];
				array[j + 1] = temp;
				// 有交换则证明无序
				isSorted = false;
				// 把无序数列的边界更新为最后一次交换元素的位置
				lastRightExchangeIndex = j;
			}
		}
		// 跟新无序数据的边界位置
		rightSortBorder = lastRightExchangeIndex;
		// 如果有序退出循环
		if (isSorted) {
			break;
		}
		// 从右往左遍历时先把isSorted置为true
		isSorted = true;
		for (let j = rightSortBorder; j > leftSortBorder; j--) {
			// 相邻元素比较，交换
			if (array[j] < array[j - 1]) {
				const temp = array[j];
				array[j] = array[j - 1];
				array[j - 1] = temp;
				// 有交换则证明无序
				isSorted = false;
				// 把无序数列的边界更新为最后一次交换元素的位置
				lastLeftExchangeIndex = j;
			}
		}
		// 跟新无序数据的边界位置
		leftSortBorder = lastLeftExchangeIndex;
		// 如果有序退出循环
		if (isSorted) {
			break;
		}
	}
	console.log(count);
}

const array = [2, 3, 4, 5, 6, 7, 8, 1];

bubbleSort(array);

console.log(array);
