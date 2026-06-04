import { StateGraph } from "@langchain/langgraph";
import { StateAnnotation } from "./state.js";
import { routerNode } from "./nodes/routerNode.js";
import { reasoningNode } from "./nodes/reasoningNode.js";
import { toolNode } from "./nodes/toolNode.js";
import { routerEdge } from "./edges/routerEdge.js";

// 1. Initialize the StateGraph with our structured state annotations
const workflow = new StateGraph(StateAnnotation)
  // 2. Add our functional reasoning and tool execution nodes
  .addNode("routerNode", routerNode)
  .addNode("reasoningNode", reasoningNode)
  .addNode("toolNode", toolNode)

  // 3. Define the initial flow transitions
  .addEdge("__start__", "routerNode")
  .addEdge("routerNode", "reasoningNode")

  // 4. Set up the conditional routing out of reasoningNode
  // Routes either to toolNode to run tools or terminates the execution at __end__
  .addConditionalEdges("reasoningNode", routerEdge, {
    tools: "toolNode",
    __end__: "__end__"
  })

  // 5. Connect toolNode back to reasoningNode
  // This allows the model to review tool outputs and output its final response or request additional tools.
  .addEdge("toolNode", "reasoningNode");

// 6. Compile and export the final workflow graph
export const graph = workflow.compile();
