#pragma once
#include <iostream>
#include <vector>
#include <stack>
#include <queue>
#include <tuple>
#include <map>
#include <set>
#include <algorithm>
#include <memory>

namespace DSA
{
	namespace Graph
	{
		namespace GraphBasic
		{
			// 边结构
			struct Edge
			{
				int u, v;           // 边的两个端点
				int weight;         // 边的权重（默认为1，表示无权图）
				Edge(int u_ = 0, int v_ = 0, int w_ = 1) : u(u_), v(v_), weight(w_) {}
			};

			// 图的邻接矩阵表示
			class AdjacencyMatrix
			{
			private:
				std::vector<std::vector<int>> matrix;  // 邻接矩阵
				int n;                                  // 顶点数
				bool directed;                          // 是否有向图

			public:
				AdjacencyMatrix(int num_nodes = 0, bool is_directed = false)
					: n(std::max(num_nodes, 0)), directed(is_directed)
				{
					matrix.resize(n + 1, std::vector<int>(n + 1, 0));
				}

				// 添加边
				void add_edge(int u, int v, int weight = 1)
				{
					if (u >= 1 && u <= n && v >= 1 && v <= n)
					{
						matrix[u][v] = weight;
						if (!directed)
							matrix[v][u] = weight;
					}
				}

				// 获取边的权重
				int get_edge(int u, int v) const
				{
					if (u >= 1 && u <= n && v >= 1 && v <= n)
						return matrix[u][v];
					return 0;
				}

				// 获取顶点数
				int size() const { return n; }

				// 获取邻接顶点列表
				std::vector<int> get_neighbors(int u) const
				{
					std::vector<int> neighbors;
					for (int v = 1; v <= n; ++v)
					{
						if (matrix[u][v] != 0)
							neighbors.push_back(v);
					}
					return neighbors;
				}

				// 打印邻接矩阵
				void print() const
				{
					std::cout << "邻接矩阵:" << std::endl;
					for (int i = 1; i <= n; ++i)
					{
						for (int j = 1; j <= n; ++j)
						{
							std::cout << matrix[i][j] << " ";
						}
						std::cout << std::endl;
					}
				}
			};

			// 图的邻接表表示
			class AdjacencyList
			{
			private:
				std::vector<std::vector<std::pair<int, int>>> adj;  // 邻接表: adj[u] = [(v, weight), ...]
				int n;                                               // 顶点数
				bool directed;                                       // 是否有向图

			public:
				AdjacencyList(int num_nodes = 0, bool is_directed = false)
					: n(std::max(num_nodes, 0)), directed(is_directed)
				{
					adj.resize(n + 1);
				}

				// 添加边
				void add_edge(int u, int v, int weight = 1)
				{
					if (u >= 1 && u <= n && v >= 1 && v <= n)
					{
						adj[u].emplace_back(v, weight);
						if (!directed)
							adj[v].emplace_back(u, weight);
					}
				}

				// 获取顶点数
				int size() const { return n; }

				// 获取邻接顶点列表（带权重）
				const std::vector<std::pair<int, int>>& get_neighbors(int u) const
				{
					static const std::vector<std::pair<int, int>> empty;
					return (u >= 1 && u <= n) ? adj[u] : empty;
				}

				// 获取邻接顶点列表（仅顶点编号）
				std::vector<int> get_neighbor_nodes(int u) const
				{
					std::vector<int> nodes;
					if (u >= 1 && u <= n)
					{
						for (const auto& edge : adj[u])
						{
							nodes.push_back(edge.first);
						}
					}
					return nodes;
				}

				// 打印邻接表
				void print() const
				{
					std::cout << "邻接表:" << std::endl;
					for (int i = 1; i <= n; ++i)
					{
						std::cout << i << ": ";
						for (const auto& edge : adj[i])
						{
							std::cout << "(" << edge.first << "," << edge.second << ") ";
						}
						std::cout << std::endl;
					}
				}
			};

			// 通用图接口（基于邻接表实现）
			class Graph
			{
			private:
				AdjacencyList adj_list;
				std::vector<std::string> node_names;  // 顶点名称映射

			public:
				Graph(int n = 0, const std::vector<std::pair<int, int>>& edges = {}, bool directed = false)
					: adj_list(n, directed)
				{
					node_names.resize(n + 1);
					for (const auto& e : edges)
					{
						adj_list.add_edge(e.first, e.second);
					}
				}

				// 添加边
				void add_edge(int u, int v, int weight = 1)
				{
					adj_list.add_edge(u, v, weight);
				}

				// 设置顶点名称
				void set_node_name(int id, const std::string& name)
				{
					if (id >= 1 && id <= adj_list.size())
						node_names[id] = name;
				}

				// 获取顶点名称
				std::string get_node_name(int id) const
				{
					if (id >= 1 && id <= adj_list.size() && !node_names[id].empty())
						return node_names[id];
					return std::to_string(id);
				}

				// 获取顶点数
				int size() const { return adj_list.size(); }

				// 获取邻接表
				const AdjacencyList& get_adjacency_list() const { return adj_list; }

				// 打印图
				void print() const
				{
					adj_list.print();
				}
			};

			// 深度优先搜索（DFS）
			class DFS
			{
			private:
				const Graph& graph;
				std::vector<bool> visited;
				std::vector<int> visit_order;
				std::vector<int> parent;
				std::stack<int> recursion_stack;

				// 递归实现
				void dfs_recursive(int u)
				{
					visited[u] = true;
					visit_order.push_back(u);
					recursion_stack.push(u);

					const auto& neighbors = graph.get_adjacency_list().get_neighbor_nodes(u);
					for (int v : neighbors)
					{
						if (!visited[v])
						{
							parent[v] = u;
							dfs_recursive(v);
						}
					}

					recursion_stack.pop();
				}

			public:
				DFS(const Graph& g) : graph(g), visited(g.size() + 1, false),
					parent(g.size() + 1, -1), visit_order() {}

				// 从指定起点开始DFS
				void run(int start)
				{
					if (start >= 1 && start <= graph.size())
					{
						dfs_recursive(start);
					}
				}

				// 遍历所有连通分量
				void run_all()
				{
					for (int i = 1; i <= graph.size(); ++i)
					{
						if (!visited[i])
						{
							dfs_recursive(i);
						}
					}
				}

				// 迭代实现DFS
				void run_iterative(int start)
				{
					std::fill(visited.begin(), visited.end(), false);
					std::fill(parent.begin(), parent.end(), -1);
					visit_order.clear();

					std::stack<int> stack;
					stack.push(start);

					while (!stack.empty())
					{
						int u = stack.top();
						stack.pop();

						if (!visited[u])
						{
							visited[u] = true;
							visit_order.push_back(u);

							// 逆序入栈以保持顺序
							const auto& neighbors = graph.get_adjacency_list().get_neighbor_nodes(u);
							for (auto it = neighbors.rbegin(); it != neighbors.rend(); ++it)
							{
								int v = *it;
								if (!visited[v])
								{
									parent[v] = u;
									stack.push(v);
								}
							}
						}
					}
				}

				// 获取访问顺序
				const std::vector<int>& get_visit_order() const { return visit_order; }

				// 获取父节点数组
				const std::vector<int>& get_parent() const { return parent; }

				// 判断是否访问过某顶点
				bool is_visited(int u) const { return visited[u]; }

				// 获取当前递归栈
				std::stack<int> get_recursion_stack() const { return recursion_stack; }

				// 打印访问顺序
				void print_order() const
				{
					std::cout << "DFS访问顺序: ";
					for (size_t i = 0; i < visit_order.size(); ++i)
					{
						if (i > 0) std::cout << " -> ";
						std::cout << graph.get_node_name(visit_order[i]);
					}
					std::cout << std::endl;
				}
			};

			// 广度优先搜索（BFS）
			class BFS
			{
			private:
				const Graph& graph;
				std::vector<bool> visited;
				std::vector<int> visit_order;
				std::vector<int> parent;
				std::vector<int> distance;  // 距起点的距离

			public:
				BFS(const Graph& g) : graph(g), visited(g.size() + 1, false),
					parent(g.size() + 1, -1), distance(g.size() + 1, -1), visit_order() {}

				// 从指定起点开始BFS
				void run(int start)
				{
					if (start < 1 || start > graph.size())
						return;

					std::queue<int> q;
					q.push(start);
					visited[start] = true;
					distance[start] = 0;

					while (!q.empty())
					{
						int u = q.front();
						q.pop();
						visit_order.push_back(u);

						const auto& neighbors = graph.get_adjacency_list().get_neighbor_nodes(u);
						for (int v : neighbors)
						{
							if (!visited[v])
							{
								visited[v] = true;
								parent[v] = u;
								distance[v] = distance[u] + 1;
								q.push(v);
							}
						}
					}
				}

				// 遍历所有连通分量
				void run_all()
				{
					for (int i = 1; i <= graph.size(); ++i)
					{
						if (!visited[i])
						{
							run(i);
						}
					}
				}

				// 获取访问顺序
				const std::vector<int>& get_visit_order() const { return visit_order; }

				// 获取父节点数组
				const std::vector<int>& get_parent() const { return parent; }

				// 获取距离数组
				const std::vector<int>& get_distance() const { return distance; }

				// 判断是否访问过某顶点
				bool is_visited(int u) const { return visited[u]; }

				// 获取从起点到指定顶点的路径
				std::vector<int> get_path(int target) const
				{
					std::vector<int> path;
					if (!visited[target])
						return path;

					for (int v = target; v != -1; v = parent[v])
					{
						path.push_back(v);
					}
					std::reverse(path.begin(), path.end());
					return path;
				}

				// 打印访问顺序
				void print_order() const
				{
					std::cout << "BFS访问顺序: ";
					for (size_t i = 0; i < visit_order.size(); ++i)
					{
						if (i > 0) std::cout << " -> ";
						std::cout << graph.get_node_name(visit_order[i]);
					}
					std::cout << std::endl;
				}

				// 打印路径
				void print_path(int target) const
				{
					std::vector<int> path = get_path(target);
					std::cout << "路径到 " << graph.get_node_name(target) << ": ";
					for (size_t i = 0; i < path.size(); ++i)
					{
						if (i > 0) std::cout << " -> ";
						std::cout << graph.get_node_name(path[i]);
					}
					std::cout << std::endl;
				}
			};

			// 连通分量检测
			class ConnectedComponents
			{
			private:
				const Graph& graph;
				std::vector<int> component_id;  // 每个顶点所属的连通分量
				int component_count;

			public:
				ConnectedComponents(const Graph& g) : graph(g), component_id(g.size() + 1, -1), component_count(0) {}

				// 查找所有连通分量
				void find_components()
				{
					std::vector<bool> visited(graph.size() + 1, false);

					for (int i = 1; i <= graph.size(); ++i)
					{
						if (!visited[i])
						{
							// 使用BFS遍历连通分量
							std::queue<int> q;
							q.push(i);
							visited[i] = true;
							component_id[i] = component_count;

							while (!q.empty())
							{
								int u = q.front();
								q.pop();

								const auto& neighbors = graph.get_adjacency_list().get_neighbor_nodes(u);
								for (int v : neighbors)
								{
									if (!visited[v])
									{
										visited[v] = true;
										component_id[v] = component_count;
										q.push(v);
									}
								}
							}

							component_count++;
						}
					}
				}

				// 获取连通分量数量
				int get_component_count() const { return component_count; }

				// 获取顶点所属的连通分量
				int get_component(int u) const { return component_id[u]; }

				// 判断两个顶点是否在同一连通分量
				bool is_connected(int u, int v) const
				{
					return component_id[u] == component_id[v];
				}

				// 获取某连通分量中的所有顶点
				std::vector<int> get_component_nodes(int component) const
				{
					std::vector<int> nodes;
					for (int i = 1; i <= graph.size(); ++i)
					{
						if (component_id[i] == component)
							nodes.push_back(i);
					}
					return nodes;
				}

				// 打印连通分量信息
				void print_components() const
				{
					std::cout << "连通分量数量: " << component_count << std::endl;
					for (int c = 0; c < component_count; ++c)
					{
						std::cout << "分量 " << c << ": ";
						for (int i = 1; i <= graph.size(); ++i)
						{
							if (component_id[i] == c)
							{
								std::cout << graph.get_node_name(i) << " ";
							}
						}
						std::cout << std::endl;
					}
				}
			};

			// 图的基本操作演示
			class GraphDemo
			{
			public:
				// 创建示例图
				static Graph create_sample_graph()
				{
					// 创建一个有6个顶点的无向图
					Graph g(6);
					g.add_edge(1, 2);
					g.add_edge(1, 3);
					g.add_edge(2, 4);
					g.add_edge(2, 5);
					g.add_edge(3, 5);
					g.add_edge(4, 6);
					g.add_edge(5, 6);

					// 设置顶点名称
					g.set_node_name(1, "A");
					g.set_node_name(2, "B");
					g.set_node_name(3, "C");
					g.set_node_name(4, "D");
					g.set_node_name(5, "E");
					g.set_node_name(6, "F");

					return g;
				}

				// 演示DFS
				static void demo_dfs()
				{
					Graph g = create_sample_graph();
					std::cout << "=== DFS演示 ===" << std::endl;
					g.print();

					DFS dfs(g);
					dfs.run(1);
					dfs.print_order();
				}

				// 演示BFS
				static void demo_bfs()
				{
					Graph g = create_sample_graph();
					std::cout << "\n=== BFS演示 ===" << std::endl;
					g.print();

					BFS bfs(g);
					bfs.run(1);
					bfs.print_order();
					bfs.print_path(6);
				}

				// 演示连通分量
				static void demo_connected_components()
				{
					Graph g(8);
					g.add_edge(1, 2);
					g.add_edge(2, 3);
					g.add_edge(4, 5);
					g.add_edge(6, 7);
					g.add_edge(7, 8);

					g.set_node_name(1, "A");
					g.set_node_name(2, "B");
					g.set_node_name(3, "C");
					g.set_node_name(4, "D");
					g.set_node_name(5, "E");
					g.set_node_name(6, "F");
					g.set_node_name(7, "G");
					g.set_node_name(8, "H");

					std::cout << "\n=== 连通分量演示 ===" << std::endl;

					ConnectedComponents cc(g);
					cc.find_components();
					cc.print_components();
				}

				// 演示有向图
				static void demo_directed_graph()
				{
					std::vector<std::pair<int, int>> edges = {
						{1, 2}, {1, 3}, {2, 4}, {3, 4}, {4, 5}, {5, 2}
					};
					Graph g(5, edges, true);

					g.set_node_name(1, "Start");
					g.set_node_name(2, "A");
					g.set_node_name(3, "B");
					g.set_node_name(4, "C");
					g.set_node_name(5, "D");

					std::cout << "\n=== 有向图DFS演示 ===" << std::endl;
					g.print();

					DFS dfs(g);
					dfs.run(1);
					dfs.print_order();
				}
			};

		}
	}
}