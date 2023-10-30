function mergeSort(array, start, end) {
	if (start >= end) return;
	// 找出数组中点
	const mid = start + parseInt((end - start) / 2);
	// 将分成的两个小数组进行排序
	mergeSort(array, start, mid);
	mergeSort(array, mid + 1, end);
	// 最后将两个小数组合并成一个大数组
	merge(array, start, mid, end);
}

function merge(array, start, mid, end) {
	// 创建一个临时数组，将两个小数组排序后的值放入临时数组里
	const tempArray = Array(end - start + 1);
	// 创建指针分别指向两个小数组和临时数组
	// p1 左侧数组指针 p2右侧数组指针 p临时数组指针
	let p1 = start,
		p2 = mid + 1,
		p = 0;
	// 比较两个数组并将其值放入临时大数组
	while (p1 <= mid && p2 <= end) {
		if (array[p1] <= array[p2]) {
			tempArray[p++] = array[p1++];
		} else {
			tempArray[p++] = array[p2++];
		}
	}
	// 如果左侧小数组还有剩余则复制到大数组
	while (p1 <= mid) {
		tempArray[p++] = array[p1++];
	}
	// 如果右侧数组还有剩余则复制到大数组
	while (p2 <= end) {
		tempArray[p++] = array[p2++];
	}
	// 最后将临时数组复制到原数组
	for (let i = 0; i < tempArray.length; i++) {
		array[i + start] = tempArray[i];
	}
}

const array = [3, 4, 2, 1, 5, 6, 7, 8, 30, 50, 1, 33, 24, 5, -4, 7, 0];

mergeSort(array, 0, array.length - 1);

console.log(array);
