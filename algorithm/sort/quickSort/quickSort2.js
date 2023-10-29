// 挖坑法
function quickSort(array, startIndex, endIndex) {
	if (startIndex >= endIndex) return;
	const piovtIndex = partition(array, startIndex, endIndex);
	quickSort(array, startIndex, piovtIndex - 1);
	quickSort(array, piovtIndex + 1, endIndex);
}
function partition(array, startIndex, endIndex) {
	// 基准点
	let piovt = array[startIndex];
	let left = startIndex;
	let right = endIndex;
	// 坑的位置 初始等于pivot的位置
	let index = startIndex;
	//大循环在左右指针重合或者交错时结束
	while (right >= left) {
		// 先从右向左遍历比较
		while (right >= left) {
			// 如果当前元素比基准元素大，则right指针向左移动一位
			// 否则将right指向的元素填入坑中，同时left指针向右移动一位
			// 然后跳出此处循环，下次循环从左向右遍历
			if (array[right] < piovt) {
				// 将right指针的元素填入坑中
				array[left] = array[right];
				// 更新坑的位置
				index = right;
				// left指针需要向右移动一位，因为当前元素在本轮已有序
				left++;
				break;
			}
			right--;
		}
		// 从左向右遍历比较
		while (right >= left) {
			// 如果当前元素比基准元素小，则left指针向右移动一位
			// 否则将left指向的元素填入坑中，同时right指针向左移动一位
			// 然后跳出此处循环，下次循环从右向左遍历
			if (array[left] > piovt) {
				// 将left指针的元素填入坑中
				array[right] = array[left];
				// 更新坑的位置
				index = left;
				// right指针需要向右移动一位，因为当前元素在本轮已有序
				right--;
				break;
			}
			left++;
		}
	}
	// 最后把基准元素的值放到index位置
	// 此时 index左侧的元素都比index指向的元素小，右侧的元素都比index指向的元素大
	// 本轮交换结束
	array[index] = piovt;
	return index;
}

const array = [3, 4, 2, 1, 5, 6, 7, 8, 30, 50, 1, 33, 24, 5, -4, 7, 0];

quickSort(array, 0, array.length - 1);

console.log(array);
