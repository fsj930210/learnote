// 指针交换法
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
	// 指针没有重合时
	while (left !== right) {
		// 先从右向左比较 ，比基准元素大则right指针向左移动一位，否则切换到left指针
		while (left < right && array[right] > piovt) {
			right--;
		}
		// 此时 right指针移动完毕 left指针比基准元素小则向右移动一位，否则交换left与right指针
		while (left < right && array[left] <= piovt) {
			left++;
		}
		// 交换left与right指针，因为left指针与right指针移动完毕，
		// 他们停止移动的条件是right指针的元素比基准元素小而left指针的元素比基准元素大
		// 我们最终实现的是基准元素的左边比基准元素小或者相等 而基准元素的右边比基准元素大
		if (left < right) {
			const temp = array[right];
			array[right] = array[left];
			array[left] = temp;
		}
	}
	// 指针重合时 需要将基准点与left指针元素交换 因为要实现准元素的左边比基准元素小或者相等 而基准元素的右边比基准元素大
	const temp = array[left];
	array[left] = array[startIndex];
	array[startIndex] = temp;
	return left;
}

const array = [3, 4, 2, 1, 5, 6, 7, 8, 30, 50, 1, 33, 24, 5, -4, 7, 0];

quickSort(array, 0, array.length - 1);

console.log(array);
