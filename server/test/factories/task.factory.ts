export class TaskFactory {
    static create(overrides = {}) {
      const defaultTask = {
        title: `Task ${Date.now()}`,
        description: `Description for task created at ${new Date().toISOString()}`,
        completed: false,
      };
      
      return { ...defaultTask, ...overrides };
    }
    
    static createMany(count: number, overrides = {}) {
      return Array.from({ length: count }, (_, i) => 
        this.create({ 
          ...overrides, 
          title: `${overrides['title'] || 'Task'} ${i + 1}` 
        })
      );
    }
  }