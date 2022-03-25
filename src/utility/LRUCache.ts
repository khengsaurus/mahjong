// @see https://medium.com/dsinjs/implementing-lru-cache-in-javascript-94ba6755cda9

class Node {
	public key: string;
	public value: any;
	public next: Node;
	public prev: Node;
	constructor(key, value, next = null, prev = null) {
		this.key = key;
		this.value = value;
		this.next = next;
		this.prev = prev;
	}
}

class LRU {
	size: number;
	limit: number;
	head: Node;
	tail: Node;
	cacheMap: IObj<string, Node>;

	constructor(limit = 70) {
		this.size = 0;
		this.limit = limit;
		this.head = null;
		this.tail = null;
		this.cacheMap = {};
	}

	write(key, value) {
		const existingNode = this.cacheMap[key];
		if (existingNode) {
			this.detach(existingNode);
			this.size--;
		} else if (this.size === this.limit) {
			delete this.cacheMap[this.tail.key];
			this.detach(this.tail);
			this.size--;
		}

		// Write to head of LinkedList
		if (!this.head) {
			this.head = this.tail = new Node(key, value);
		} else {
			const node = new Node(key, value, this.head);
			this.head.prev = node;
			this.head = node;
		}

		// update cacheMap with LinkedList key and Node reference
		this.cacheMap[key] = this.head;
		this.size++;
	}

	read(key) {
		const existingNode = this.cacheMap[key];
		if (existingNode) {
			const value = existingNode.value;
			// Make the node as new Head of LinkedList if not already
			if (this.head !== existingNode) {
				// write will automatically remove the node from it's position and make it a new head i.e most used
				this.write(key, value);
			}
			return value;
		} else {
			return null;
		}
	}

	detach(node) {
		if (node.prev !== null) {
			node.prev.next = node.next;
		} else {
			this.head = node.next;
		}

		if (node.next !== null) {
			node.next.prev = node.prev;
		} else {
			this.tail = node.prev;
		}
	}

	clear() {
		this.head = null;
		this.tail = null;
		this.size = 0;
		this.cacheMap = {};
	}

	// Invokes the callback function with every node of the chain and the index of the node.
	forEach(fn) {
		let node = this.head;
		let counter = 0;
		while (node) {
			fn(node, counter);
			node = node.next;
			counter++;
		}
	}

	// To iterate over LRU with a 'for...of' loop
	*[Symbol.iterator]() {
		let node = this.head;
		while (node) {
			yield node;
			node = node.next;
		}
	}
}

const mainLRUCache = new LRU();
const secondaryLRU = new LRU(20);
export { mainLRUCache, secondaryLRU };