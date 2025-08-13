import { startWorkflow, stopWorkflow, listWorkflows } from '../actions/workflows';

export default async function WorkflowsPage() {
  // Get recent workflows
  const workflowsResult = await listWorkflows({ limit: 10 });
  const workflows = workflowsResult.success ? workflowsResult.data as any : null;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Workflows</h1>
      
      <div className="grid gap-6">
        {/* Start Workflow Form */}
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Start Workflow</h2>
          <form action={async (formData: FormData) => {
            'use server';
            const id = formData.get('id') as string;
            const variables = formData.get('variables') as string;
            
            if (id) {
              const parsedVariables = variables ? JSON.parse(variables) : undefined;
              await startWorkflow(id, parsedVariables);
            }
          }}>
            <div className="space-y-4">
              <div>
                <label htmlFor="id" className="block text-sm font-medium mb-2">
                  Workflow ID
                </label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  defaultValue="backup-files"
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="variables" className="block text-sm font-medium mb-2">
                  Variables (JSON)
                </label>
                <textarea
                  id="variables"
                  name="variables"
                  defaultValue='{"sourcePath": "/documents", "destinationPath": "/backups"}'
                  className="w-full p-2 border rounded-md h-20"
                  placeholder='{"key": "value"}'
                />
              </div>
              
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
              >
                Start Workflow
              </button>
            </div>
          </form>
        </div>

        {/* Recent Workflows */}
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Recent Workflows</h2>
          
          {workflows ? (
            <div className="space-y-4">
              {workflows.executions.length > 0 ? (
                workflows.executions.map((execution: any) => (
                  <div key={execution.executionId} className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <p className="font-medium">Execution: {execution.executionId}</p>
                      <p className="text-sm text-muted-foreground">
                        Status: {execution.status} | 
                        Started: {new Date(execution.startedAt).toLocaleString()}
                      </p>
                    </div>
                    
                    {execution.status === 'running' && (
                      <form action={async (formData: FormData) => {
                        'use server';
                        const executionId = formData.get('executionId') as string;
                        if (executionId) {
                          await stopWorkflow(executionId);
                        }
                      }}>
                        <input type="hidden" name="executionId" value={execution.executionId} />
                        <button
                          type="submit"
                          className="bg-destructive text-destructive-foreground px-3 py-1 rounded-md text-sm hover:bg-destructive/90"
                        >
                          Stop
                        </button>
                      </form>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No workflows found</p>
              )}
            </div>
          ) : (
            <p className="text-destructive">Error loading workflows</p>
          )}
        </div>
      </div>
    </div>
  );
}
