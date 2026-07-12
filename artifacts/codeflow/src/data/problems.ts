// Bundled, fully self-contained practice library for CodeFlow.
// This ships with the client bundle -- no backend call is required to read it.
// Adding a new problem later is just appending another entry to PROBLEMS below.

export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Language = 'cpp' | 'java' | 'python';

export interface ProblemSolution {
  code: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  topic: string;
  tags: string[];
  summary: string;
  explanation: string;
  solutions: Record<Language, ProblemSolution>;
}

export const LANGUAGE_LABELS: Record<Language, string> = {
  cpp: 'C++',
  java: 'Java',
  python: 'Python',
};

export const TOPICS = [
  'Arrays',
  'Strings',
  'Two Pointers',
  'Sliding Window',
  'Binary Search',
  'Linked Lists',
  'Stacks',
  'Queues',
  'Trees',
  'Binary Search Trees',
  'Heaps',
  'Graphs',
  'Dynamic Programming',
  'Backtracking',
  'Greedy',
  'Recursion',
] as const;

export const PROBLEMS: Problem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    topic: 'Arrays',
    tags: ['array', 'hash-map'],
    summary:
      'Given an array of integers and a target, return the indices of the two numbers that add up to the target.',
    explanation:
      'Walk the array once. For each value, check a hash map for the complement (target - value). If it exists, you found your pair. Otherwise store the current value with its index. This trades the O(n^2) brute force for a single O(n) pass at the cost of O(n) extra space.',
    solutions: {
      cpp: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        code: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < (int)nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.count(complement)) {
            return {seen[complement], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}`,
      },
      java: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        code: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement)) {
            return new int[]{seen.get(complement), i};
        }
        seen.put(nums[i], i);
    }
    return new int[0];
}`,
      },
      python: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        code: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
      },
    },
  },
  {
    id: 'best-time-to-buy-and-sell-stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    topic: 'Arrays',
    tags: ['array', 'greedy', 'dp'],
    summary:
      'Given daily stock prices, find the maximum profit from buying on one day and selling on a later day.',
    explanation:
      'Track the lowest price seen so far while scanning left to right. At each day, the best possible profit if you sold today is price[i] - minSoFar. Keep the running maximum of that value. One pass, constant space.',
    solutions: {
      cpp: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: `int maxProfit(vector<int>& prices) {
    int minPrice = INT_MAX;
    int best = 0;
    for (int price : prices) {
        minPrice = min(minPrice, price);
        best = max(best, price - minPrice);
    }
    return best;
}`,
      },
      java: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: `public int maxProfit(int[] prices) {
    int minPrice = Integer.MAX_VALUE;
    int best = 0;
    for (int price : prices) {
        minPrice = Math.min(minPrice, price);
        best = Math.max(best, price - minPrice);
    }
    return best;
}`,
      },
      python: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: `def max_profit(prices):
    min_price = float('inf')
    best = 0
    for price in prices:
        min_price = min(min_price, price)
        best = max(best, price - min_price)
    return best`,
      },
    },
  },
  {
    id: 'contains-duplicate',
    title: 'Contains Duplicate',
    difficulty: 'Easy',
    topic: 'Arrays',
    tags: ['array', 'hash-set'],
    summary: 'Determine if an array contains any value that appears at least twice.',
    explanation:
      'Insert values into a hash set as you scan. If a value is already present, a duplicate exists. This is the optimal approach since any comparison-based method needs at least O(n) work to inspect every element.',
    solutions: {
      cpp: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        code: `bool containsDuplicate(vector<int>& nums) {
    unordered_set<int> seen;
    for (int n : nums) {
        if (!seen.insert(n).second) return true;
    }
    return false;
}`,
      },
      java: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        code: `public boolean containsDuplicate(int[] nums) {
    Set<Integer> seen = new HashSet<>();
    for (int n : nums) {
        if (!seen.add(n)) return true;
    }
    return false;
}`,
      },
      python: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        code: `def contains_duplicate(nums):
    seen = set()
    for n in nums:
        if n in seen:
            return True
        seen.add(n)
    return False`,
      },
    },
  },
  {
    id: 'product-of-array-except-self',
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    topic: 'Arrays',
    tags: ['array', 'prefix-product'],
    summary:
      'Return an array where each element is the product of all other elements, without using division.',
    explanation:
      'Compute a prefix product array (product of everything to the left) and a suffix product array (product of everything to the right), then multiply them elementwise. The suffix pass can be folded into the output array itself using a single running variable to keep space at O(1) extra beyond the output.',
    solutions: {
      cpp: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1) extra (excluding output)',
        code: `vector<int> productExceptSelf(vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n, 1);
    int prefix = 1;
    for (int i = 0; i < n; i++) {
        result[i] = prefix;
        prefix *= nums[i];
    }
    int suffix = 1;
    for (int i = n - 1; i >= 0; i--) {
        result[i] *= suffix;
        suffix *= nums[i];
    }
    return result;
}`,
      },
      java: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1) extra (excluding output)',
        code: `public int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    int prefix = 1;
    for (int i = 0; i < n; i++) {
        result[i] = prefix;
        prefix *= nums[i];
    }
    int suffix = 1;
    for (int i = n - 1; i >= 0; i--) {
        result[i] *= suffix;
        suffix *= nums[i];
    }
    return result;
}`,
      },
      python: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1) extra (excluding output)',
        code: `def product_except_self(nums):
    n = len(nums)
    result = [1] * n
    prefix = 1
    for i in range(n):
        result[i] = prefix
        prefix *= nums[i]
    suffix = 1
    for i in range(n - 1, -1, -1):
        result[i] *= suffix
        suffix *= nums[i]
    return result`,
      },
    },
  },
  {
    id: 'maximum-subarray',
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    topic: 'Arrays',
    tags: ['array', 'dp', 'kadane'],
    summary: 'Find the contiguous subarray with the largest sum.',
    explanation:
      "Kadane's algorithm: keep a running sum of the best subarray ending at the current index. If that running sum ever drops below the current element alone, restart the subarray from here. Track the best value seen across the whole scan.",
    solutions: {
      cpp: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: `int maxSubArray(vector<int>& nums) {
    int best = nums[0];
    int current = nums[0];
    for (int i = 1; i < (int)nums.size(); i++) {
        current = max(nums[i], current + nums[i]);
        best = max(best, current);
    }
    return best;
}`,
      },
      java: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: `public int maxSubArray(int[] nums) {
    int best = nums[0];
    int current = nums[0];
    for (int i = 1; i < nums.length; i++) {
        current = Math.max(nums[i], current + nums[i]);
        best = Math.max(best, current);
    }
    return best;
}`,
      },
      python: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: `def max_sub_array(nums):
    best = nums[0]
    current = nums[0]
    for num in nums[1:]:
        current = max(num, current + num)
        best = max(best, current)
    return best`,
      },
    },
  },
  {
    id: 'valid-anagram',
    title: 'Valid Anagram',
    difficulty: 'Easy',
    topic: 'Strings',
    tags: ['string', 'hash-map'],
    summary: 'Determine if two strings are anagrams of each other.',
    explanation:
      'Anagrams share the exact same character counts. Build a frequency map from the first string, decrement it while scanning the second, and confirm every count returns to zero. Length mismatch is an instant rejection.',
    solutions: {
      cpp: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1) (bounded alphabet)',
        code: `bool isAnagram(string s, string t) {
    if (s.size() != t.size()) return false;
    int counts[26] = {0};
    for (char c : s) counts[c - 'a']++;
    for (char c : t) if (--counts[c - 'a'] < 0) return false;
    return true;
}`,
      },
      java: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1) (bounded alphabet)',
        code: `public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    int[] counts = new int[26];
    for (char c : s.toCharArray()) counts[c - 'a']++;
    for (char c : t.toCharArray()) {
        if (--counts[c - 'a'] < 0) return false;
    }
    return true;
}`,
      },
      python: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1) (bounded alphabet)',
        code: `def is_anagram(s, t):
    if len(s) != len(t):
        return False
    counts = Counter(s)
    for ch in t:
        counts[ch] -= 1
        if counts[ch] < 0:
            return False
    return True`,
      },
    },
  },
  {
    id: 'longest-substring-without-repeating-characters',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    topic: 'Sliding Window',
    tags: ['string', 'sliding-window', 'hash-map'],
    summary: 'Find the length of the longest substring without repeating characters.',
    explanation:
      'Maintain a sliding window [left, right] and a map of the last seen index of each character. When you encounter a character already inside the window, jump left forward to just past its previous occurrence. Track the max window size along the way.',
    solutions: {
      cpp: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(min(n, alphabet size))',
        code: `int lengthOfLongestSubstring(string s) {
    unordered_map<char, int> lastSeen;
    int left = 0, best = 0;
    for (int right = 0; right < (int)s.size(); right++) {
        char c = s[right];
        if (lastSeen.count(c) && lastSeen[c] >= left) {
            left = lastSeen[c] + 1;
        }
        lastSeen[c] = right;
        best = max(best, right - left + 1);
    }
    return best;
}`,
      },
      java: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(min(n, alphabet size))',
        code: `public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> lastSeen = new HashMap<>();
    int left = 0, best = 0;
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        if (lastSeen.containsKey(c) && lastSeen.get(c) >= left) {
            left = lastSeen.get(c) + 1;
        }
        lastSeen.put(c, right);
        best = Math.max(best, right - left + 1);
    }
    return best;
}`,
      },
      python: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(min(n, alphabet size))',
        code: `def length_of_longest_substring(s):
    last_seen = {}
    left = 0
    best = 0
    for right, ch in enumerate(s):
        if ch in last_seen and last_seen[ch] >= left:
            left = last_seen[ch] + 1
        last_seen[ch] = right
        best = max(best, right - left + 1)
    return best`,
      },
    },
  },
  {
    id: 'container-with-most-water',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    topic: 'Two Pointers',
    tags: ['array', 'two-pointers', 'greedy'],
    summary: 'Given heights of vertical lines, find two that form the container holding the most water.',
    explanation:
      'Start pointers at both ends. The area is limited by the shorter of the two lines, so moving the taller pointer inward can never help -- only shrinking the shorter side has a chance to find a bigger area. Always move the pointer at the shorter line inward, tracking the best area seen.',
    solutions: {
      cpp: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: `int maxArea(vector<int>& height) {
    int left = 0, right = height.size() - 1;
    int best = 0;
    while (left < right) {
        int area = min(height[left], height[right]) * (right - left);
        best = max(best, area);
        if (height[left] < height[right]) left++;
        else right--;
    }
    return best;
}`,
      },
      java: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: `public int maxArea(int[] height) {
    int left = 0, right = height.length - 1;
    int best = 0;
    while (left < right) {
        int area = Math.min(height[left], height[right]) * (right - left);
        best = Math.max(best, area);
        if (height[left] < height[right]) left++;
        else right--;
    }
    return best;
}`,
      },
      python: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: `def max_area(height):
    left, right = 0, len(height) - 1
    best = 0
    while left < right:
        area = min(height[left], height[right]) * (right - left)
        best = max(best, area)
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return best`,
      },
    },
  },
  {
    id: '3sum',
    title: '3Sum',
    difficulty: 'Medium',
    topic: 'Two Pointers',
    tags: ['array', 'two-pointers', 'sorting'],
    summary: 'Find all unique triplets in an array that sum to zero.',
    explanation:
      'Sort the array first. Fix each number in turn, then use a two-pointer scan on the remaining sorted subarray to find pairs that sum to its negation. Skip duplicate values at every level to avoid repeated triplets.',
    solutions: {
      cpp: {
        timeComplexity: 'O(n^2)',
        spaceComplexity: 'O(1) extra (excluding output)',
        code: `vector<vector<int>> threeSum(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> result;
    int n = nums.size();
    for (int i = 0; i < n - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        int left = i + 1, right = n - 1;
        while (left < right) {
            int sum = nums[i] + nums[left] + nums[right];
            if (sum == 0) {
                result.push_back({nums[i], nums[left], nums[right]});
                left++; right--;
                while (left < right && nums[left] == nums[left - 1]) left++;
                while (left < right && nums[right] == nums[right + 1]) right--;
            } else if (sum < 0) {
                left++;
            } else {
                right--;
            }
        }
    }
    return result;
}`,
      },
      java: {
        timeComplexity: 'O(n^2)',
        spaceComplexity: 'O(1) extra (excluding output)',
        code: `public List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> result = new ArrayList<>();
    int n = nums.length;
    for (int i = 0; i < n - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        int left = i + 1, right = n - 1;
        while (left < right) {
            int sum = nums[i] + nums[left] + nums[right];
            if (sum == 0) {
                result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                left++; right--;
                while (left < right && nums[left] == nums[left - 1]) left++;
                while (left < right && nums[right] == nums[right + 1]) right--;
            } else if (sum < 0) {
                left++;
            } else {
                right--;
            }
        }
    }
    return result;
}`,
      },
      python: {
        timeComplexity: 'O(n^2)',
        spaceComplexity: 'O(1) extra (excluding output)',
        code: `def three_sum(nums):
    nums.sort()
    result = []
    n = len(nums)
    for i in range(n - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        left, right = i + 1, n - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total == 0:
                result.append([nums[i], nums[left], nums[right]])
                left += 1
                right -= 1
                while left < right and nums[left] == nums[left - 1]:
                    left += 1
                while left < right and nums[right] == nums[right + 1]:
                    right -= 1
            elif total < 0:
                left += 1
            else:
                right -= 1
    return result`,
      },
    },
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Easy',
    topic: 'Binary Search',
    tags: ['array', 'binary-search'],
    summary: 'Search a sorted array for a target value and return its index, or -1.',
    explanation:
      'Classic binary search: repeatedly halve the search range by comparing the target to the midpoint. Move the low bound up when the target is larger, the high bound down when it is smaller, and return the midpoint on a match.',
    solutions: {
      cpp: {
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)',
        code: `int search(vector<int>& nums, int target) {
    int lo = 0, hi = nums.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
      },
      java: {
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)',
        code: `public int search(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
      },
      python: {
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)',
        code: `def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
      },
    },
  },
  {
    id: 'search-in-rotated-sorted-array',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    topic: 'Binary Search',
    tags: ['array', 'binary-search'],
    summary: 'Search a target in a sorted array that has been rotated at an unknown pivot.',
    explanation:
      'At every step, one half of the current range is guaranteed sorted. Compare the target against that sorted half to decide which side to keep. This preserves binary search behavior even though the whole array is not sorted globally.',
    solutions: {
      cpp: {
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)',
        code: `int search(vector<int>& nums, int target) {
    int lo = 0, hi = nums.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[lo] <= nums[mid]) {
            if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
            else lo = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
            else hi = mid - 1;
        }
    }
    return -1;
}`,
      },
      java: {
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)',
        code: `public int search(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[lo] <= nums[mid]) {
            if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
            else lo = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
            else hi = mid - 1;
        }
    }
    return -1;
}`,
      },
      python: {
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)',
        code: `def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1`,
      },
    },
  },
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    topic: 'Linked Lists',
    tags: ['linked-list', 'iterative'],
    summary: 'Reverse a singly linked list in place.',
    explanation:
      'Walk the list once, keeping a pointer to the previous node. At each node, save its next pointer, redirect it to point backward at prev, then advance prev and current forward. When current becomes null, prev is the new head.',
    solutions: {
      cpp: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: `ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr) {
        ListNode* next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
      },
      java: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: `public ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode curr = head;
    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
      },
      python: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: `def reverse_list(head):
    prev = None
    curr = head
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev`,
      },
    },
  },
  {
    id: 'merge-two-sorted-lists',
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    topic: 'Linked Lists',
    tags: ['linked-list', 'merge'],
    summary: 'Merge two sorted linked lists into a single sorted list.',
    explanation:
      'Use a dummy head node and a tail pointer. Repeatedly attach whichever of the two current nodes is smaller, advancing that list. When one list runs out, attach the remainder of the other directly.',
    solutions: {
      cpp: {
        timeComplexity: 'O(n + m)',
        spaceComplexity: 'O(1)',
        code: `ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
    ListNode dummy(0);
    ListNode* tail = &dummy;
    while (l1 && l2) {
        if (l1->val <= l2->val) {
            tail->next = l1;
            l1 = l1->next;
        } else {
            tail->next = l2;
            l2 = l2->next;
        }
        tail = tail->next;
    }
    tail->next = l1 ? l1 : l2;
    return dummy.next;
}`,
      },
      java: {
        timeComplexity: 'O(n + m)',
        spaceComplexity: 'O(1)',
        code: `public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode(0);
    ListNode tail = dummy;
    while (l1 != null && l2 != null) {
        if (l1.val <= l2.val) {
            tail.next = l1;
            l1 = l1.next;
        } else {
            tail.next = l2;
            l2 = l2.next;
        }
        tail = tail.next;
    }
    tail.next = (l1 != null) ? l1 : l2;
    return dummy.next;
}`,
      },
      python: {
        timeComplexity: 'O(n + m)',
        spaceComplexity: 'O(1)',
        code: `def merge_two_lists(l1, l2):
    dummy = ListNode(0)
    tail = dummy
    while l1 and l2:
        if l1.val <= l2.val:
            tail.next = l1
            l1 = l1.next
        else:
            tail.next = l2
            l2 = l2.next
        tail = tail.next
    tail.next = l1 if l1 else l2
    return dummy.next`,
      },
    },
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    topic: 'Stacks',
    tags: ['string', 'stack'],
    summary: 'Determine if a string of brackets is validly matched and nested.',
    explanation:
      'Push opening brackets onto a stack. On a closing bracket, it must match the type on top of the stack, which is then popped. If the stack is empty at a closing bracket, or non-empty at the end, the string is invalid.',
    solutions: {
      cpp: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        code: `bool isValid(string s) {
    stack<char> st;
    unordered_map<char, char> pairs = {{')', '('}, {']', '['}, {'}', '{'}};
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') {
            st.push(c);
        } else {
            if (st.empty() || st.top() != pairs[c]) return false;
            st.pop();
        }
    }
    return st.empty();
}`,
      },
      java: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        code: `public boolean isValid(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    Map<Character, Character> pairs = Map.of(')', '(', ']', '[', '}', '{');
    for (char c : s.toCharArray()) {
        if (c == '(' || c == '[' || c == '{') {
            stack.push(c);
        } else {
            if (stack.isEmpty() || stack.pop() != pairs.get(c)) return false;
        }
    }
    return stack.isEmpty();
}`,
      },
      python: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        code: `def is_valid(s):
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    for ch in s:
        if ch in '([{':
            stack.append(ch)
        else:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack`,
      },
    },
  },
  {
    id: 'maximum-depth-of-binary-tree',
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    topic: 'Trees',
    tags: ['tree', 'dfs', 'recursion'],
    summary: 'Find the maximum depth (number of nodes on the longest path) of a binary tree.',
    explanation:
      "A tree's depth is 1 plus the deeper of its two subtrees' depths, with an empty tree having depth 0. This recursive definition maps directly onto a depth-first traversal.",
    solutions: {
      cpp: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(h) recursion stack',
        code: `int maxDepth(TreeNode* root) {
    if (!root) return 0;
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}`,
      },
      java: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(h) recursion stack',
        code: `public int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
      },
      python: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(h) recursion stack',
        code: `def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))`,
      },
    },
  },
  {
    id: 'invert-binary-tree',
    title: 'Invert Binary Tree',
    difficulty: 'Easy',
    topic: 'Trees',
    tags: ['tree', 'dfs', 'recursion'],
    summary: 'Flip a binary tree into its mirror image.',
    explanation:
      "Recursively invert the left and right subtrees, then swap them at the current node. The base case is a null node, which is already its own mirror.",
    solutions: {
      cpp: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(h) recursion stack',
        code: `TreeNode* invertTree(TreeNode* root) {
    if (!root) return nullptr;
    TreeNode* left = invertTree(root->left);
    TreeNode* right = invertTree(root->right);
    root->left = right;
    root->right = left;
    return root;
}`,
      },
      java: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(h) recursion stack',
        code: `public TreeNode invertTree(TreeNode root) {
    if (root == null) return null;
    TreeNode left = invertTree(root.left);
    TreeNode right = invertTree(root.right);
    root.left = right;
    root.right = left;
    return root;
}`,
      },
      python: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(h) recursion stack',
        code: `def invert_tree(root):
    if not root:
        return None
    root.left, root.right = invert_tree(root.right), invert_tree(root.left)
    return root`,
      },
    },
  },
  {
    id: 'validate-binary-search-tree',
    title: 'Validate Binary Search Tree',
    difficulty: 'Medium',
    topic: 'Binary Search Trees',
    tags: ['tree', 'bst', 'dfs'],
    summary: 'Determine whether a binary tree satisfies the binary search tree property.',
    explanation:
      "Carry a valid (low, high) range down through the recursion. Every node's value must fall strictly inside its inherited range; then the left child inherits (low, node.val) and the right child inherits (node.val, high).",
    solutions: {
      cpp: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(h) recursion stack',
        code: `bool validate(TreeNode* node, long long lo, long long hi) {
    if (!node) return true;
    if (node->val <= lo || node->val >= hi) return false;
    return validate(node->left, lo, node->val) && validate(node->right, node->val, hi);
}

bool isValidBST(TreeNode* root) {
    return validate(root, LLONG_MIN, LLONG_MAX);
}`,
      },
      java: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(h) recursion stack',
        code: `public boolean isValidBST(TreeNode root) {
    return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);
}

private boolean validate(TreeNode node, long lo, long hi) {
    if (node == null) return true;
    if (node.val <= lo || node.val >= hi) return false;
    return validate(node.left, lo, node.val) && validate(node.right, node.val, hi);
}`,
      },
      python: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(h) recursion stack',
        code: `def is_valid_bst(root):
    def validate(node, lo, hi):
        if not node:
            return True
        if not (lo < node.val < hi):
            return False
        return validate(node.left, lo, node.val) and validate(node.right, node.val, hi)
    return validate(root, float('-inf'), float('inf'))`,
      },
    },
  },
  {
    id: 'top-k-frequent-elements',
    title: 'Top K Frequent Elements',
    difficulty: 'Medium',
    topic: 'Heaps',
    tags: ['heap', 'hash-map', 'bucket-sort'],
    summary: 'Return the k most frequent elements in an array.',
    explanation:
      'Count frequencies with a hash map, then bucket the values by frequency (bucket index = frequency, since frequency is bounded by array length). Walk the buckets from highest frequency down, collecting elements until k are found -- this beats a full sort at O(n) instead of O(n log n).',
    solutions: {
      cpp: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        code: `vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int, int> counts;
    for (int n : nums) counts[n]++;
    vector<vector<int>> buckets(nums.size() + 1);
    for (auto& [num, freq] : counts) buckets[freq].push_back(num);
    vector<int> result;
    for (int freq = buckets.size() - 1; freq >= 0 && (int)result.size() < k; freq--) {
        for (int num : buckets[freq]) {
            result.push_back(num);
            if ((int)result.size() == k) break;
        }
    }
    return result;
}`,
      },
      java: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        code: `public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> counts = new HashMap<>();
    for (int n : nums) counts.merge(n, 1, Integer::sum);
    List<Integer>[] buckets = new List[nums.length + 1];
    for (var entry : counts.entrySet()) {
        int freq = entry.getValue();
        if (buckets[freq] == null) buckets[freq] = new ArrayList<>();
        buckets[freq].add(entry.getKey());
    }
    List<Integer> result = new ArrayList<>();
    for (int freq = buckets.length - 1; freq >= 0 && result.size() < k; freq--) {
        if (buckets[freq] != null) {
            for (int num : buckets[freq]) {
                result.add(num);
                if (result.size() == k) break;
            }
        }
    }
    return result.stream().mapToInt(Integer::intValue).toArray();
}`,
      },
      python: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        code: `def top_k_frequent(nums, k):
    counts = Counter(nums)
    buckets = [[] for _ in range(len(nums) + 1)]
    for num, freq in counts.items():
        buckets[freq].append(num)
    result = []
    for freq in range(len(buckets) - 1, -1, -1):
        for num in buckets[freq]:
            result.append(num)
            if len(result) == k:
                return result
    return result`,
      },
    },
  },
  {
    id: 'number-of-islands',
    title: 'Number of Islands',
    difficulty: 'Medium',
    topic: 'Graphs',
    tags: ['graph', 'dfs', 'bfs', 'grid'],
    summary: 'Count the number of connected islands of land in a 2D grid.',
    explanation:
      'Scan every cell; when an unvisited land cell is found, it marks a new island, so flood-fill (DFS or BFS) from it to sink every connected land cell so it is never counted again. The total number of flood-fills triggered is the island count.',
    solutions: {
      cpp: {
        timeComplexity: 'O(rows * cols)',
        spaceComplexity: 'O(rows * cols) recursion stack worst case',
        code: `void sink(vector<vector<char>>& grid, int r, int c) {
    if (r < 0 || c < 0 || r >= (int)grid.size() || c >= (int)grid[0].size() || grid[r][c] != '1') return;
    grid[r][c] = '0';
    sink(grid, r + 1, c);
    sink(grid, r - 1, c);
    sink(grid, r, c + 1);
    sink(grid, r, c - 1);
}

int numIslands(vector<vector<char>>& grid) {
    int count = 0;
    for (int r = 0; r < (int)grid.size(); r++) {
        for (int c = 0; c < (int)grid[0].size(); c++) {
            if (grid[r][c] == '1') {
                count++;
                sink(grid, r, c);
            }
        }
    }
    return count;
}`,
      },
      java: {
        timeComplexity: 'O(rows * cols)',
        spaceComplexity: 'O(rows * cols) recursion stack worst case',
        code: `public int numIslands(char[][] grid) {
    int count = 0;
    for (int r = 0; r < grid.length; r++) {
        for (int c = 0; c < grid[0].length; c++) {
            if (grid[r][c] == '1') {
                count++;
                sink(grid, r, c);
            }
        }
    }
    return count;
}

private void sink(char[][] grid, int r, int c) {
    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] != '1') return;
    grid[r][c] = '0';
    sink(grid, r + 1, c);
    sink(grid, r - 1, c);
    sink(grid, r, c + 1);
    sink(grid, r, c - 1);
}`,
      },
      python: {
        timeComplexity: 'O(rows * cols)',
        spaceComplexity: 'O(rows * cols) recursion stack worst case',
        code: `def num_islands(grid):
    rows, cols = len(grid), len(grid[0])

    def sink(r, c):
        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != '1':
            return
        grid[r][c] = '0'
        sink(r + 1, c)
        sink(r - 1, c)
        sink(r, c + 1)
        sink(r, c - 1)

    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                sink(r, c)
    return count`,
      },
    },
  },
  {
    id: 'course-schedule',
    title: 'Course Schedule',
    difficulty: 'Medium',
    topic: 'Graphs',
    tags: ['graph', 'topological-sort', 'dfs'],
    summary: 'Determine if it is possible to finish all courses given their prerequisite dependencies.',
    explanation:
      'Model courses and prerequisites as a directed graph, then check for a cycle using DFS with three states per node (unvisited, in-progress, done). A cycle means some course depends on itself transitively, making the schedule impossible.',
    solutions: {
      cpp: {
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V + E)',
        code: `bool dfs(int node, vector<vector<int>>& graph, vector<int>& state) {
    if (state[node] == 1) return false;
    if (state[node] == 2) return true;
    state[node] = 1;
    for (int next : graph[node]) {
        if (!dfs(next, graph, state)) return false;
    }
    state[node] = 2;
    return true;
}

bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> graph(numCourses);
    for (auto& p : prerequisites) graph[p[1]].push_back(p[0]);
    vector<int> state(numCourses, 0);
    for (int i = 0; i < numCourses; i++) {
        if (!dfs(i, graph, state)) return false;
    }
    return true;
}`,
      },
      java: {
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V + E)',
        code: `public boolean canFinish(int numCourses, int[][] prerequisites) {
    List<List<Integer>> graph = new ArrayList<>();
    for (int i = 0; i < numCourses; i++) graph.add(new ArrayList<>());
    for (int[] p : prerequisites) graph.get(p[1]).add(p[0]);
    int[] state = new int[numCourses];
    for (int i = 0; i < numCourses; i++) {
        if (!dfs(i, graph, state)) return false;
    }
    return true;
}

private boolean dfs(int node, List<List<Integer>> graph, int[] state) {
    if (state[node] == 1) return false;
    if (state[node] == 2) return true;
    state[node] = 1;
    for (int next : graph.get(node)) {
        if (!dfs(next, graph, state)) return false;
    }
    state[node] = 2;
    return true;
}`,
      },
      python: {
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V + E)',
        code: `def can_finish(num_courses, prerequisites):
    graph = [[] for _ in range(num_courses)]
    for course, prereq in prerequisites:
        graph[prereq].append(course)
    state = [0] * num_courses

    def dfs(node):
        if state[node] == 1:
            return False
        if state[node] == 2:
            return True
        state[node] = 1
        for nxt in graph[node]:
            if not dfs(nxt):
                return False
        state[node] = 2
        return True

    return all(dfs(i) for i in range(num_courses))`,
      },
    },
  },
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    topic: 'Dynamic Programming',
    tags: ['dp', 'fibonacci'],
    summary: 'Count how many distinct ways you can climb n stairs taking 1 or 2 steps at a time.',
    explanation:
      'The number of ways to reach step n is the sum of the ways to reach n-1 (then take a single step) and n-2 (then take a double step) -- this is exactly the Fibonacci recurrence. Track only the last two values to get constant space.',
    solutions: {
      cpp: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: `int climbStairs(int n) {
    if (n <= 2) return n;
    int prev2 = 1, prev1 = 2;
    for (int i = 3; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}`,
      },
      java: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: `public int climbStairs(int n) {
    if (n <= 2) return n;
    int prev2 = 1, prev1 = 2;
    for (int i = 3; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}`,
      },
      python: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: `def climb_stairs(n):
    if n <= 2:
        return n
    prev2, prev1 = 1, 2
    for _ in range(3, n + 1):
        prev2, prev1 = prev1, prev1 + prev2
    return prev1`,
      },
    },
  },
  {
    id: 'house-robber',
    title: 'House Robber',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    tags: ['dp'],
    summary: 'Maximize money robbed from houses in a row without robbing two adjacent houses.',
    explanation:
      "At each house, you either skip it (keep the best total up to the previous house) or rob it (its value plus the best total up to two houses back). Carrying just those two running values forward avoids needing a full DP array.",
    solutions: {
      cpp: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: `int rob(vector<int>& nums) {
    int prev2 = 0, prev1 = 0;
    for (int num : nums) {
        int curr = max(prev1, prev2 + num);
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}`,
      },
      java: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: `public int rob(int[] nums) {
    int prev2 = 0, prev1 = 0;
    for (int num : nums) {
        int curr = Math.max(prev1, prev2 + num);
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}`,
      },
      python: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: `def rob(nums):
    prev2, prev1 = 0, 0
    for num in nums:
        prev2, prev1 = prev1, max(prev1, prev2 + num)
    return prev1`,
      },
    },
  },
  {
    id: 'coin-change',
    title: 'Coin Change',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    tags: ['dp', 'unbounded-knapsack'],
    summary: 'Find the fewest number of coins needed to make up a given amount.',
    explanation:
      'Build a DP array where dp[a] is the minimum coins to make amount a. For each amount from 1 upward, try every coin denomination that fits and take the best of dp[a - coin] + 1. dp[0] is 0 by definition; unreachable amounts stay at infinity.',
    solutions: {
      cpp: {
        timeComplexity: 'O(amount * coins)',
        spaceComplexity: 'O(amount)',
        code: `int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, INT_MAX);
    dp[0] = 0;
    for (int a = 1; a <= amount; a++) {
        for (int coin : coins) {
            if (coin <= a && dp[a - coin] != INT_MAX) {
                dp[a] = min(dp[a], dp[a - coin] + 1);
            }
        }
    }
    return dp[amount] == INT_MAX ? -1 : dp[amount];
}`,
      },
      java: {
        timeComplexity: 'O(amount * coins)',
        spaceComplexity: 'O(amount)',
        code: `public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, Integer.MAX_VALUE);
    dp[0] = 0;
    for (int a = 1; a <= amount; a++) {
        for (int coin : coins) {
            if (coin <= a && dp[a - coin] != Integer.MAX_VALUE) {
                dp[a] = Math.min(dp[a], dp[a - coin] + 1);
            }
        }
    }
    return dp[amount] == Integer.MAX_VALUE ? -1 : dp[amount];
}`,
      },
      python: {
        timeComplexity: 'O(amount * coins)',
        spaceComplexity: 'O(amount)',
        code: `def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for coin in coins:
            if coin <= a and dp[a - coin] != float('inf'):
                dp[a] = min(dp[a], dp[a - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`,
      },
    },
  },
  {
    id: 'longest-increasing-subsequence',
    title: 'Longest Increasing Subsequence',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    tags: ['dp', 'binary-search'],
    summary: 'Find the length of the longest strictly increasing subsequence in an array.',
    explanation:
      'Maintain a list "tails" where tails[k] is the smallest possible tail value of an increasing subsequence of length k+1. For each number, binary search tails for the first entry >= it and replace it there (or append if none). The final length of tails is the answer.',
    solutions: {
      cpp: {
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
        code: `int lengthOfLIS(vector<int>& nums) {
    vector<int> tails;
    for (int num : nums) {
        auto it = lower_bound(tails.begin(), tails.end(), num);
        if (it == tails.end()) tails.push_back(num);
        else *it = num;
    }
    return tails.size();
}`,
      },
      java: {
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
        code: `public int lengthOfLIS(int[] nums) {
    int[] tails = new int[nums.length];
    int size = 0;
    for (int num : nums) {
        int lo = 0, hi = size;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (tails[mid] < num) lo = mid + 1;
            else hi = mid;
        }
        tails[lo] = num;
        if (lo == size) size++;
    }
    return size;
}`,
      },
      python: {
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
        code: `from bisect import bisect_left

def length_of_lis(nums):
    tails = []
    for num in nums:
        idx = bisect_left(tails, num)
        if idx == len(tails):
            tails.append(num)
        else:
            tails[idx] = num
    return len(tails)`,
      },
    },
  },
  {
    id: 'subsets',
    title: 'Subsets',
    difficulty: 'Medium',
    topic: 'Backtracking',
    tags: ['backtracking', 'recursion'],
    summary: 'Generate all possible subsets (the power set) of a distinct integer array.',
    explanation:
      'Backtrack through the array: at each index, first record the current partial subset, then recursively try including each remaining element exactly once. Backtracking undoes each choice before trying the next, avoiding duplicates by only moving forward through the array.',
    solutions: {
      cpp: {
        timeComplexity: 'O(2^n)',
        spaceComplexity: 'O(n) recursion stack (excluding output)',
        code: `void backtrack(vector<int>& nums, int start, vector<int>& current, vector<vector<int>>& result) {
    result.push_back(current);
    for (int i = start; i < (int)nums.size(); i++) {
        current.push_back(nums[i]);
        backtrack(nums, i + 1, current, result);
        current.pop_back();
    }
}

vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> result;
    vector<int> current;
    backtrack(nums, 0, current, result);
    return result;
}`,
      },
      java: {
        timeComplexity: 'O(2^n)',
        spaceComplexity: 'O(n) recursion stack (excluding output)',
        code: `public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(nums, 0, new ArrayList<>(), result);
    return result;
}

private void backtrack(int[] nums, int start, List<Integer> current, List<List<Integer>> result) {
    result.add(new ArrayList<>(current));
    for (int i = start; i < nums.length; i++) {
        current.add(nums[i]);
        backtrack(nums, i + 1, current, result);
        current.remove(current.size() - 1);
    }
}`,
      },
      python: {
        timeComplexity: 'O(2^n)',
        spaceComplexity: 'O(n) recursion stack (excluding output)',
        code: `def subsets(nums):
    result = []
    current = []

    def backtrack(start):
        result.append(current[:])
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1)
            current.pop()

    backtrack(0)
    return result`,
      },
    },
  },
  {
    id: 'permutations',
    title: 'Permutations',
    difficulty: 'Medium',
    topic: 'Backtracking',
    tags: ['backtracking', 'recursion'],
    summary: 'Generate all possible permutations of a distinct integer array.',
    explanation:
      'Backtrack by swapping the current index with every candidate at or after it, recursing into the next position, then swapping back. This builds every permutation in place without extra bookkeeping for used elements.',
    solutions: {
      cpp: {
        timeComplexity: 'O(n * n!)',
        spaceComplexity: 'O(n) recursion stack (excluding output)',
        code: `void backtrack(vector<int>& nums, int start, vector<vector<int>>& result) {
    if (start == (int)nums.size()) {
        result.push_back(nums);
        return;
    }
    for (int i = start; i < (int)nums.size(); i++) {
        swap(nums[start], nums[i]);
        backtrack(nums, start + 1, result);
        swap(nums[start], nums[i]);
    }
}

vector<vector<int>> permute(vector<int>& nums) {
    vector<vector<int>> result;
    backtrack(nums, 0, result);
    return result;
}`,
      },
      java: {
        timeComplexity: 'O(n * n!)',
        spaceComplexity: 'O(n) recursion stack (excluding output)',
        code: `public List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(nums, 0, result);
    return result;
}

private void backtrack(int[] nums, int start, List<List<Integer>> result) {
    if (start == nums.length) {
        List<Integer> perm = new ArrayList<>();
        for (int n : nums) perm.add(n);
        result.add(perm);
        return;
    }
    for (int i = start; i < nums.length; i++) {
        swap(nums, start, i);
        backtrack(nums, start + 1, result);
        swap(nums, start, i);
    }
}

private void swap(int[] nums, int i, int j) {
    int tmp = nums[i];
    nums[i] = nums[j];
    nums[j] = tmp;
}`,
      },
      python: {
        timeComplexity: 'O(n * n!)',
        spaceComplexity: 'O(n) recursion stack (excluding output)',
        code: `def permute(nums):
    result = []

    def backtrack(start):
        if start == len(nums):
            result.append(nums[:])
            return
        for i in range(start, len(nums)):
            nums[start], nums[i] = nums[i], nums[start]
            backtrack(start + 1)
            nums[start], nums[i] = nums[i], nums[start]

    backtrack(0)
    return result`,
      },
    },
  },
  {
    id: 'jump-game',
    title: 'Jump Game',
    difficulty: 'Medium',
    topic: 'Greedy',
    tags: ['array', 'greedy'],
    summary: 'Determine if you can reach the last index, jumping at most nums[i] steps from index i.',
    explanation:
      'Track the furthest index reachable so far. Scan left to right; if the current index ever exceeds that furthest reach, the end is unreachable. Otherwise keep extending the reach with nums[i], since a greedy furthest-reach is always at least as good as any specific jump choice.',
    solutions: {
      cpp: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: `bool canJump(vector<int>& nums) {
    int furthest = 0;
    for (int i = 0; i < (int)nums.size(); i++) {
        if (i > furthest) return false;
        furthest = max(furthest, i + nums[i]);
    }
    return true;
}`,
      },
      java: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: `public boolean canJump(int[] nums) {
    int furthest = 0;
    for (int i = 0; i < nums.length; i++) {
        if (i > furthest) return false;
        furthest = Math.max(furthest, i + nums[i]);
    }
    return true;
}`,
      },
      python: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: `def can_jump(nums):
    furthest = 0
    for i, num in enumerate(nums):
        if i > furthest:
            return False
        furthest = max(furthest, i + num)
    return True`,
      },
    },
  },
  {
    id: 'fibonacci',
    title: 'Fibonacci Number',
    difficulty: 'Easy',
    topic: 'Recursion',
    tags: ['recursion', 'dp'],
    summary: 'Compute the nth Fibonacci number.',
    explanation:
      'Naive recursion recomputes the same subproblems exponentially many times. Iterating forward while keeping only the previous two values computes the same result in linear time and constant space.',
    solutions: {
      cpp: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: `int fib(int n) {
    if (n < 2) return n;
    int prev2 = 0, prev1 = 1;
    for (int i = 2; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}`,
      },
      java: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: `public int fib(int n) {
    if (n < 2) return n;
    int prev2 = 0, prev1 = 1;
    for (int i = 2; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}`,
      },
      python: {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        code: `def fib(n):
    if n < 2:
        return n
    prev2, prev1 = 0, 1
    for _ in range(2, n + 1):
        prev2, prev1 = prev1, prev1 + prev2
    return prev1`,
      },
    },
  },
];

export function getProblemById(id: string): Problem | undefined {
  return PROBLEMS.find((p) => p.id === id);
}
