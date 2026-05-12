#include <iostream>
#include <string>
#include <vector>
#include <sstream>
#include <algorithm>
#include "json.hpp"

using json = nlohmann::json;

// ========== Utility ==========

std::vector<std::string> split(const std::string& s, char delim) {
    std::vector<std::string> tokens;
    std::stringstream ss(s);
    std::string token;
    while (std::getline(ss, token, delim)) tokens.push_back(token);
    return tokens;
}

std::vector<int> parse_int_list(const std::string& s) {
    std::vector<int> result;
    for (auto& t : split(s, ',')) {
        result.push_back(std::stoi(t));
    }
    return result;
}

template<typename T>
json array_to_json(const std::vector<T>& v) {
    json arr = json::array();
    for (size_t i = 0; i < v.size(); i++) {
        json node;
        node["id"] = i;
        node["value"] = v[i];
        arr.push_back(node);
    }
    return arr;
}

// ========== Data Structure: Array (Vector) ==========

json init_array(const std::vector<int>& data) {
    json result;
    result["type"] = "array";
    result["nodes"] = array_to_json(data);
    result["length"] = data.size();
    return result;
}

json step_array_insert(std::vector<int> data, int position, int value) {
    json result;
    result["type"] = "array";
    result["action"] = "insert";
    result["position"] = position;
    result["value"] = value;

    json steps = json::array();
    // Step 1: highlight position
    steps.push_back({{"phase", "locate"}, {"position", position}, {"nodes", array_to_json(data)}});
    // Step 2: shift elements right
    if (position >= 0 && position <= (int)data.size()) {
        data.insert(data.begin() + position, value);
    }
    steps.push_back({{"phase", "result"}, {"nodes", array_to_json(data)}});

    result["steps"] = steps;
    result["final_state"] = {{"nodes", array_to_json(data)}, {"length", data.size()}};
    return result;
}

json step_array_delete(std::vector<int> data, int position) {
    json result;
    result["type"] = "array";
    result["action"] = "delete";
    result["position"] = position;

    json steps = json::array();
    steps.push_back({{"phase", "locate"}, {"position", position}, {"nodes", array_to_json(data)}});
    if (position >= 0 && position < (int)data.size()) {
        data.erase(data.begin() + position);
    }
    steps.push_back({{"phase", "result"}, {"nodes", array_to_json(data)}});

    result["steps"] = steps;
    result["final_state"] = {{"nodes", array_to_json(data)}, {"length", data.size()}};
    return result;
}

// ========== Data Structure: Linked List ==========

json init_linked_list(const std::vector<int>& data) {
    json result;
    result["type"] = "linked-list";
    json nodes = json::array();
    for (size_t i = 0; i < data.size(); i++) {
        json node;
        node["id"] = "n" + std::to_string(i + 1);
        node["value"] = data[i];
        node["next"] = (i + 1 < data.size()) ? json("n" + std::to_string(i + 2)) : json();
        nodes.push_back(node);
    }
    result["nodes"] = nodes;
    result["head"] = data.empty() ? json() : json("n1");
    return result;
}

json step_linked_list_insert(const std::vector<int>& data, int position, int value) {
    std::vector<int> new_data = data;
    if (position >= 0 && position <= (int)new_data.size()) {
        new_data.insert(new_data.begin() + position, value);
    }
    json result = init_linked_list(new_data);
    result["action"] = "insert";
    result["position"] = position;
    result["value"] = value;

    json steps = json::array();
    steps.push_back({{"phase", "locate"}, {"position", position}, {"nodes", init_linked_list(data)["nodes"]}});
    steps.push_back({{"phase", "result"}, {"nodes", result["nodes"]}});
    result["steps"] = steps;
    result["final_state"] = {{"nodes", result["nodes"]}, {"head", result["head"]}};
    return result;
}

json step_linked_list_delete(const std::vector<int>& data, int position) {
    std::vector<int> new_data = data;
    if (position >= 0 && position < (int)new_data.size()) {
        new_data.erase(new_data.begin() + position);
    }
    json result = init_linked_list(new_data);
    result["action"] = "delete";
    result["position"] = position;

    json steps = json::array();
    steps.push_back({{"phase", "locate"}, {"position", position}, {"nodes", init_linked_list(data)["nodes"]}});
    steps.push_back({{"phase", "result"}, {"nodes", result["nodes"]}});
    result["steps"] = steps;
    result["final_state"] = {{"nodes", result["nodes"]}, {"head", result["head"]}};
    return result;
}

// ========== Data Structure: Stack ==========

json init_stack(const std::vector<int>& data) {
    json result;
    result["type"] = "stack";
    json items = json::array();
    for (int v : data) items.push_back(v);
    result["stack"] = items;
    result["top"] = data.empty() ? -1 : data.back();
    result["size"] = data.size();
    return result;
}

json step_stack_push(std::vector<int> data, int value) {
    json before = init_stack(data);
    data.push_back(value);
    json after = init_stack(data);

    json result;
    result["type"] = "stack";
    result["action"] = "push";
    result["value"] = value;
    result["steps"] = {{{"phase", "before"}, {"state", before}},
                       {{"phase", "after"}, {"state", after}}};
    result["final_state"] = after;
    return result;
}

json step_stack_pop(std::vector<int> data) {
    json before = init_stack(data);
    int popped = data.empty() ? 0 : data.back();
    if (!data.empty()) data.pop_back();
    json after = init_stack(data);

    json result;
    result["type"] = "stack";
    result["action"] = "pop";
    result["popped"] = popped;
    result["steps"] = {{{"phase", "before"}, {"state", before}},
                       {{"phase", "after"}, {"state", after}}};
    result["final_state"] = after;
    return result;
}

// ========== Data Structure: Queue ==========

json init_queue(const std::vector<int>& data) {
    json result;
    result["type"] = "queue";
    json items = json::array();
    for (int v : data) items.push_back(v);
    result["queue"] = items;
    result["front"] = data.empty() ? -1 : 0;
    result["rear"] = data.empty() ? -1 : (int)data.size() - 1;
    result["size"] = data.size();
    return result;
}

json step_queue_enqueue(std::vector<int> data, int value) {
    json before = init_queue(data);
    data.insert(data.begin(), value);  // front is index 0
    json after = init_queue(data);

    json result;
    result["type"] = "queue";
    result["action"] = "enqueue";
    result["value"] = value;
    result["steps"] = {{{"phase", "before"}, {"state", before}},
                       {{"phase", "after"}, {"state", after}}};
    result["final_state"] = after;
    return result;
}

json step_queue_dequeue(std::vector<int> data) {
    json before = init_queue(data);
    int dequeued = data.empty() ? 0 : data.back();
    if (!data.empty()) data.pop_back();
    json after = init_queue(data);

    json result;
    result["type"] = "queue";
    result["action"] = "dequeue";
    result["dequeued"] = dequeued;
    result["steps"] = {{{"phase", "before"}, {"state", before}},
                       {{"phase", "after"}, {"state", after}}};
    result["final_state"] = after;
    return result;
}

// ========== Data Structure: Binary Tree / BST ==========

struct TreeNode {
    int value;
    int left;
    int right;
};

json tree_node_to_json(const std::vector<TreeNode>& nodes, int idx) {
    if (idx < 0 || idx >= (int)nodes.size()) return json();
    json node;
    node["value"] = nodes[idx].value;
    node["left"] = tree_node_to_json(nodes, nodes[idx].left);
    node["right"] = tree_node_to_json(nodes, nodes[idx].right);
    return node;
}

json bst_init(const std::vector<int>& data) {
    // Build BST by inserting values in order
    std::vector<TreeNode> nodes;
    json insert_steps = json::array();

    for (int val : data) {
        json step;
        step["value"] = val;
        json path = json::array();

        if (nodes.empty()) {
            nodes.push_back({val, -1, -1});
        } else {
            int cur = 0;
            while (true) {
                path.push_back(nodes[cur].value);
                if (val < nodes[cur].value) {
                    if (nodes[cur].left == -1) {
                        nodes[cur].left = nodes.size();
                        nodes.push_back({val, -1, -1});
                        break;
                    }
                    cur = nodes[cur].left;
                } else {
                    if (nodes[cur].right == -1) {
                        nodes[cur].right = nodes.size();
                        nodes.push_back({val, -1, -1});
                        break;
                    }
                    cur = nodes[cur].right;
                }
            }
        }
        step["path"] = path;
        step["tree"] = tree_node_to_json(nodes, 0);
        insert_steps.push_back(step);
    }

    json result;
    result["type"] = "bst";
    result["initial_values"] = data;
    result["root"] = nodes.empty() ? json() : tree_node_to_json(nodes, 0);
    result["insert_steps"] = insert_steps;
    return result;
}

json bst_insert(const std::vector<int>& data, int value) {
    std::vector<int> new_data = data;
    new_data.push_back(value);
    json full = bst_init(new_data);
    full["action"] = "insert";
    full["value"] = value;
    full["final_state"] = {{"root", full["root"]}};
    return full;
}

json bst_search(const std::vector<int>& data, int target) {
    // Simulate BST search step by step
    json result;
    result["type"] = "bst";
    result["action"] = "search";
    result["target"] = target;

    std::vector<TreeNode> nodes;
    for (int val : data) {
        if (nodes.empty()) {
            nodes.push_back({val, -1, -1});
        } else {
            int cur = 0;
            while (true) {
                if (val < nodes[cur].value) {
                    if (nodes[cur].left == -1) { nodes[cur].left = nodes.size(); nodes.push_back({val, -1, -1}); break; }
                    cur = nodes[cur].left;
                } else {
                    if (nodes[cur].right == -1) { nodes[cur].right = nodes.size(); nodes.push_back({val, -1, -1}); break; }
                    cur = nodes[cur].right;
                }
            }
        }
    }

    json steps = json::array();
    if (!nodes.empty()) {
        int cur = 0;
        while (true) {
            json step;
            step["visited"] = nodes[cur].value;
            if (nodes[cur].value == target) {
                step["found"] = true;
                steps.push_back(step);
                break;
            }
            step["found"] = false;
            if (target < nodes[cur].value) {
                step["direction"] = "left";
                if (nodes[cur].left == -1) break;
                cur = nodes[cur].left;
            } else {
                step["direction"] = "right";
                if (nodes[cur].right == -1) break;
                cur = nodes[cur].right;
            }
            steps.push_back(step);
        }
    }

    result["steps"] = steps;
    return result;
}

// ========== Data Structure: Graph ==========

json graph_init(const std::string& node_str, const std::string& edge_str) {
    auto node_names = split(node_str, ',');
    json nodes = json::array();
    for (const auto& name : node_names) {
        nodes.push_back({{"id", name}});
    }

    json edges = json::array();
    if (!edge_str.empty()) {
        auto edge_parts = split(edge_str, ',');
        for (const auto& part : edge_parts) {
            auto sub = split(part, ':');
            auto pair = split(sub[0], '-');
            int weight = sub.size() > 1 ? std::stoi(sub[1]) : 1;
            edges.push_back({{"source", pair[0]}, {"target", pair[1]}, {"weight", weight}});
        }
    }

    json result;
    result["type"] = "graph";
    result["nodes"] = nodes;
    result["edges"] = edges;
    return result;
}

// ========== Sorting Algorithms with Step Tracking ==========

json sort_bubble(std::vector<int> arr) {
    json result;
    result["algorithm"] = "bubble";
    result["initial"] = arr;
    json steps = json::array();
    int n = arr.size();

    for (int i = 0; i < n - 1; i++) {
        bool any_swap = false;
        for (int j = 0; j < n - i - 1; j++) {
            json step;
            step["phase"] = "compare";
            step["indices"] = {j, j + 1};
            step["values"] = {arr[j], arr[j + 1]};
            if (arr[j] > arr[j + 1]) {
                std::swap(arr[j], arr[j + 1]);
                step["swapped"] = true;
                any_swap = true;
            } else {
                step["swapped"] = false;
            }
            steps.push_back(step);
        }
        if (!any_swap) break;
    }

    result["steps"] = steps;
    result["final"] = arr;
    result["total_steps"] = steps.size();
    return result;
}

json sort_selection(std::vector<int> arr) {
    json result;
    result["algorithm"] = "selection";
    result["initial"] = arr;
    json steps = json::array();
    int n = arr.size();

    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            json step;
            step["phase"] = "compare";
            step["indices"] = {min_idx, j};
            step["values"] = {arr[min_idx], arr[j]};
            if (arr[j] < arr[min_idx]) {
                step["new_min"] = true;
                min_idx = j;
            } else {
                step["new_min"] = false;
            }
            steps.push_back(step);
        }
        if (min_idx != i) {
            json swap_step;
            swap_step["phase"] = "swap";
            swap_step["indices"] = {i, min_idx};
            swap_step["values"] = {arr[i], arr[min_idx]};
            std::swap(arr[i], arr[min_idx]);
            steps.push_back(swap_step);
        }
    }

    result["steps"] = steps;
    result["final"] = arr;
    result["total_steps"] = steps.size();
    return result;
}

json sort_insertion(std::vector<int> arr) {
    json result;
    result["algorithm"] = "insertion";
    result["initial"] = arr;
    json steps = json::array();
    int n = arr.size();

    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        json shift_step;
        shift_step["phase"] = "pick";
        shift_step["index"] = i;
        shift_step["value"] = key;
        steps.push_back(shift_step);

        while (j >= 0 && arr[j] > key) {
            json move_step;
            move_step["phase"] = "shift";
            move_step["from"] = j;
            move_step["to"] = j + 1;
            move_step["value"] = arr[j];
            arr[j + 1] = arr[j];
            steps.push_back(move_step);
            j--;
        }
        arr[j + 1] = key;
        json place_step;
        place_step["phase"] = "place";
        place_step["index"] = j + 1;
        place_step["value"] = key;
        steps.push_back(place_step);
    }

    result["steps"] = steps;
    result["final"] = arr;
    result["total_steps"] = steps.size();
    return result;
}

json sort_quick(std::vector<int> arr) {
    json result;
    result["algorithm"] = "quick";
    result["initial"] = arr;
    json steps = json::array();

    std::function<void(int, int)> quick_sort;
    quick_sort = [&](int low, int high) {
        if (low >= high) return;
        int pivot = arr[high];
        int i = low - 1;

        steps.push_back({{"phase", "pivot"}, {"index", high}, {"value", pivot}});

        for (int j = low; j < high; j++) {
            json step;
            step["phase"] = "compare";
            step["indices"] = {j, high};
            step["values"] = {arr[j], pivot};
            if (arr[j] <= pivot) {
                i++;
                if (i != j) {
                    step["swapped"] = true;
                    step["swap_indices"] = {i, j};
                    std::swap(arr[i], arr[j]);
                } else {
                    step["swapped"] = false;
                }
            } else {
                step["swapped"] = false;
            }
            steps.push_back(step);
        }
        i++;
        if (i != high) {
            steps.push_back({{"phase", "swap_pivot"}, {"indices", {i, high}}, {"values", {arr[i], arr[high]}}});
        }
        std::swap(arr[i], arr[high]);

        int pivot_idx = i;
        quick_sort(low, pivot_idx - 1);
        quick_sort(pivot_idx + 1, high);
    };

    if (!arr.empty()) quick_sort(0, arr.size() - 1);

    result["steps"] = steps;
    result["final"] = arr;
    result["total_steps"] = steps.size();
    return result;
}

json sort_merge(std::vector<int> arr) {
    json result;
    result["algorithm"] = "merge";
    result["initial"] = arr;
    json steps = json::array();

    std::function<void(int, int)> merge_sort;
    merge_sort = [&](int left, int right) {
        if (left >= right) return;
        int mid = left + (right - left) / 2;
        steps.push_back({{"phase", "divide"}, {"range", {left, right}}, {"mid", mid}});

        merge_sort(left, mid);
        merge_sort(mid + 1, right);

        // Merge
        std::vector<int> temp;
        int i = left, j = mid + 1;
        json merge_step;
        merge_step["phase"] = "merge";
        merge_step["range"] = {left, right};

        std::vector<int> before(arr.begin() + left, arr.begin() + right + 1);
        merge_step["before"] = before;

        while (i <= mid && j <= right) {
            if (arr[i] <= arr[j]) {
                temp.push_back(arr[i++]);
            } else {
                temp.push_back(arr[j++]);
            }
        }
        while (i <= mid) temp.push_back(arr[i++]);
        while (j <= right) temp.push_back(arr[j++]);

        for (int k = 0; k < (int)temp.size(); k++) {
            arr[left + k] = temp[k];
        }
        std::vector<int> after(arr.begin() + left, arr.begin() + right + 1);
        merge_step["after"] = after;
        steps.push_back(merge_step);
    };

    if (!arr.empty()) merge_sort(0, arr.size() - 1);

    result["steps"] = steps;
    result["final"] = arr;
    result["total_steps"] = steps.size();
    return result;
}

json sort_heap(std::vector<int> arr) {
    json result;
    result["algorithm"] = "heap";
    result["initial"] = arr;
    json steps = json::array();
    int n = arr.size();

    std::function<void(int, int)> heapify = [&](int size, int root) {
        int largest = root;
        int left = 2 * root + 1;
        int right = 2 * root + 2;

        if (left < size) {
            steps.push_back({{"phase", "compare"}, {"indices", {largest, left}}, {"values", {arr[largest], arr[left]}}});
            if (arr[left] > arr[largest]) largest = left;
        }
        if (right < size) {
            steps.push_back({{"phase", "compare"}, {"indices", {largest, right}}, {"values", {arr[largest], arr[right]}}});
            if (arr[right] > arr[largest]) largest = right;
        }
        if (largest != root) {
            steps.push_back({{"phase", "swap"}, {"indices", {root, largest}}, {"values", {arr[root], arr[largest]}}});
            std::swap(arr[root], arr[largest]);
            heapify(size, largest);
        }
    };

    // Build max heap
    for (int i = n / 2 - 1; i >= 0; i--) {
        steps.push_back({{"phase", "heapify"}, {"root", i}});
        heapify(n, i);
    }

    // Extract elements
    for (int i = n - 1; i > 0; i--) {
        steps.push_back({{"phase", "extract"}, {"swap_indices", {0, i}}, {"values", {arr[0], arr[i]}}});
        std::swap(arr[0], arr[i]);
        heapify(i, 0);
    }

    result["steps"] = steps;
    result["final"] = arr;
    result["total_steps"] = steps.size();
    return result;
}

// ========== Graph Traversal ==========

json graph_bfs(const std::string& node_str, const std::string& edge_str, const std::string& start) {
    json graph = graph_init(node_str, edge_str);
    json result;
    result["type"] = "graph";
    result["algorithm"] = "bfs";
    result["start"] = start;

    auto node_names = split(node_str, ',');
    auto edges = graph["edges"];

    std::map<std::string, std::vector<std::string>> adj;
    for (const auto& e : edges) {
        std::string src = e["source"];
        std::string dst = e["target"];
        adj[src].push_back(dst);
        adj[dst].push_back(src);
    }

    json steps = json::array();
    std::map<std::string, bool> visited;
    std::vector<std::string> queue = {start};
    visited[start] = true;

    while (!queue.empty()) {
        std::string cur = queue.front();
        queue.erase(queue.begin());
        json step;
        step["phase"] = "visit";
        step["node"] = cur;
        json neighbors = json::array();
        for (const auto& nb : adj[cur]) {
            if (!visited[nb]) {
                visited[nb] = true;
                queue.push_back(nb);
                neighbors.push_back(nb);
            }
        }
        step["discovered"] = neighbors;
        steps.push_back(step);
    }

    result["steps"] = steps;
    return result;
}

json graph_dfs(const std::string& node_str, const std::string& edge_str, const std::string& start) {
    json graph = graph_init(node_str, edge_str);
    json result;
    result["type"] = "graph";
    result["algorithm"] = "dfs";
    result["start"] = start;

    auto node_names = split(node_str, ',');
    auto edges = graph["edges"];

    std::map<std::string, std::vector<std::string>> adj;
    for (const auto& e : edges) {
        std::string src = e["source"];
        std::string dst = e["target"];
        adj[src].push_back(dst);
        adj[dst].push_back(src);
    }

    json steps = json::array();
    std::map<std::string, bool> visited;

    std::function<void(const std::string&, int)> dfs = [&](const std::string& node, int depth) {
        visited[node] = true;
        json step;
        step["phase"] = "visit";
        step["node"] = node;
        step["depth"] = depth;
        json neighbors = json::array();
        for (const auto& nb : adj[node]) {
            if (!visited[nb]) {
                neighbors.push_back(nb);
                dfs(nb, depth + 1);
            }
        }
        step["discovered"] = neighbors;
        steps.push_back(step);
    };

    dfs(start, 0);

    result["steps"] = steps;
    return result;
}

// ========== Main ==========

void print_usage() {
    std::cerr << "Usage: dsa-cli <command> [args...]\n\n"
              << "Commands:\n"
              << "  init <struct> [values]                     Get initial state\n"
              << "  step <struct> [values] <op> [args...]       Execute one operation\n"
              << "  sort <algorithm> [values]                   Run sort with step tracking\n"
              << "  search <struct> [values] <target>           Run search with step tracking\n"
              << "  traverse <struct> <nodes> <edges> <method> <start>  Graph traversal\n"
              << "\n"
              << "Structures: array, linked-list, stack, queue, bst, graph\n"
              << "Algorithms: bubble, selection, insertion, quick, merge, heap\n"
              << "Traversal: bfs, dfs\n"
              << "\n"
              << "Examples:\n"
              << "  dsa-cli init array 5,3,8,1,9\n"
              << "  dsa-cli init linked-list 10,20,30\n"
              << "  dsa-cli init stack 1,2,3\n"
              << "  dsa-cli init queue 1,2,3\n"
              << "  dsa-cli init bst 8,3,10,1,6,14\n"
              << "  dsa-cli init graph A,B,C,D,E A-B:4,A-C:2,B-C:1,B-D:5,C-D:8\n"
              << "  dsa-cli step array 5,3,8,1,9 insert 2 7\n"
              << "  dsa-cli step array 5,3,8,1,9 delete 1\n"
              << "  dsa-cli step stack 1,2,3 push 4\n"
              << "  dsa-cli step stack 1,2,3,4 pop\n"
              << "  dsa-cli step queue 1,2,3 enqueue 4\n"
              << "  dsa-cli step queue 1,2,3,4 dequeue\n"
              << "  dsa-cli step bst 8,3,10,1,6 insert 4\n"
              << "  dsa-cli sort bubble 5,3,8,1,9\n"
              << "  dsa-cli sort quick 5,3,8,1,9\n"
              << "  dsa-cli search bst 8,3,10,1,6,14 6\n"
              << "  dsa-cli traverse graph A,B,C,D,E A-B:2,A-C:1,B-D:3,C-D:1 bfs A\n"
              << "  dsa-cli traverse graph A,B,C,D,E A-B:2,A-C:1,B-D:3,C-D:1 dfs A\n";
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        print_usage();
        return 1;
    }

    std::string command = argv[1];
    json output;
    output["status"] = "ok";

    try {
        if (command == "init") {
            if (argc < 3) { print_usage(); return 1; }
            std::string struct_type = argv[2];
            std::string data_str = argc > 3 ? argv[3] : "";

            if (struct_type == "array") {
                output["state"] = init_array(parse_int_list(data_str));
            } else if (struct_type == "linked-list") {
                output["state"] = init_linked_list(parse_int_list(data_str));
            } else if (struct_type == "stack") {
                output["state"] = init_stack(parse_int_list(data_str));
            } else if (struct_type == "queue") {
                output["state"] = init_queue(parse_int_list(data_str));
            } else if (struct_type == "bst") {
                output["state"] = bst_init(parse_int_list(data_str));
            } else if (struct_type == "graph") {
                output["state"] = graph_init(data_str, argc > 4 ? argv[4] : "");
            } else {
                output["status"] = "error";
                output["message"] = "Unknown struct: " + struct_type;
            }

        } else if (command == "step") {
            if (argc < 5) { print_usage(); return 1; }
            std::string struct_type = argv[2];
            auto data = parse_int_list(argv[3]);
            std::string op = argv[4];

            if (struct_type == "array") {
                if (op == "insert" && argc >= 7) {
                    int pos = std::stoi(argv[5]);
                    int val = std::stoi(argv[6]);
                    output["result"] = step_array_insert(data, pos, val);
                } else if (op == "delete" && argc >= 6) {
                    int pos = std::stoi(argv[5]);
                    output["result"] = step_array_delete(data, pos);
                } else { output["status"] = "error"; output["message"] = "Unknown op for array"; }
            } else if (struct_type == "linked-list") {
                if (op == "insert" && argc >= 7) {
                    int pos = std::stoi(argv[5]);
                    int val = std::stoi(argv[6]);
                    output["result"] = step_linked_list_insert(data, pos, val);
                } else if (op == "delete" && argc >= 6) {
                    int pos = std::stoi(argv[5]);
                    output["result"] = step_linked_list_delete(data, pos);
                } else { output["status"] = "error"; output["message"] = "Unknown op for linked-list"; }
            } else if (struct_type == "stack") {
                if (op == "push" && argc >= 6) {
                    int val = std::stoi(argv[5]);
                    output["result"] = step_stack_push(data, val);
                } else if (op == "pop") {
                    output["result"] = step_stack_pop(data);
                } else { output["status"] = "error"; output["message"] = "Unknown op for stack"; }
            } else if (struct_type == "queue") {
                if (op == "enqueue" && argc >= 6) {
                    int val = std::stoi(argv[5]);
                    output["result"] = step_queue_enqueue(data, val);
                } else if (op == "dequeue") {
                    output["result"] = step_queue_dequeue(data);
                } else { output["status"] = "error"; output["message"] = "Unknown op for queue"; }
            } else if (struct_type == "bst") {
                if (op == "insert" && argc >= 6) {
                    int val = std::stoi(argv[5]);
                    output["result"] = bst_insert(data, val);
                } else { output["status"] = "error"; output["message"] = "Unknown op for bst"; }
            } else {
                output["status"] = "error";
                output["message"] = "Unknown struct: " + struct_type;
            }

        } else if (command == "sort") {
            if (argc < 4) { print_usage(); return 1; }
            std::string algo = argv[2];
            auto data = parse_int_list(argv[3]);

            if (algo == "bubble") output["result"] = sort_bubble(data);
            else if (algo == "selection") output["result"] = sort_selection(data);
            else if (algo == "insertion") output["result"] = sort_insertion(data);
            else if (algo == "quick") output["result"] = sort_quick(data);
            else if (algo == "merge") output["result"] = sort_merge(data);
            else if (algo == "heap") output["result"] = sort_heap(data);
            else { output["status"] = "error"; output["message"] = "Unknown algorithm: " + algo; }

        } else if (command == "search") {
            if (argc < 5) { print_usage(); return 1; }
            std::string struct_type = argv[2];
            auto data = parse_int_list(argv[3]);
            int target = std::stoi(argv[4]);

            if (struct_type == "bst") {
                output["result"] = bst_search(data, target);
            } else {
                output["status"] = "error";
                output["message"] = "Search not supported for: " + struct_type;
            }

        } else if (command == "traverse") {
            if (argc < 7) { print_usage(); return 1; }
            std::string struct_type = argv[2];
            std::string nodes_str = argv[3];
            std::string edges_str = argv[4];
            std::string method = argv[5];
            std::string start = argv[6];

            if (struct_type == "graph") {
                if (method == "bfs") {
                    output["result"] = graph_bfs(nodes_str, edges_str, start);
                } else if (method == "dfs") {
                    output["result"] = graph_dfs(nodes_str, edges_str, start);
                } else {
                    output["status"] = "error";
                    output["message"] = "Unknown traversal method: " + method;
                }
            } else {
                output["status"] = "error";
                output["message"] = "Traversal not supported for: " + struct_type;
            }

        } else if (command == "list") {
            output["structures"] = {"array", "linked-list", "stack", "queue", "bst", "graph"};
            output["algorithms"] = {"bubble", "selection", "insertion", "quick", "merge", "heap"};
            output["traversals"] = {"bfs", "dfs"};

        } else {
            output["status"] = "error";
            output["message"] = "Unknown command: " + command;
        }
    } catch (const std::exception& e) {
        output["status"] = "error";
        output["message"] = e.what();
    }

    std::cout << output.dump(2) << std::endl;
    return output["status"] == "error" ? 1 : 0;
}
