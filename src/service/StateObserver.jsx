class StateObserver {
  constructor() {
    this.store = new Map();
  }

  subscribe(event, className, callback) {
    // event -> className -> callback
    if (!this.store.has(event)) {
      this.store.set(event, new Map());
    }
    const eventMap = this.store.get(event);
    eventMap.set(className, callback);
    return () => eventMap.delete(className);
  }

  publish(event, value) {
    if (this.store.has(event)) {
      const eventMap = this.store.get(event);
      eventMap.forEach((handler) => handler(value));
    }
  }
}

export default StateObserver;