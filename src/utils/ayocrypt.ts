
class AyoCrypt {
  // Custom symbol mapping for character replacement
  private static readonly symbolMap: { [key: string]: string } = {
    'a': '⚡', 'b': '🔥', 'c': '⭐', 'd': '🌙', 'e': '☀️',
    'f': '🌊', 'g': '🌸', 'h': '🍀', 'i': '❄️', 'j': '🌈',
    'k': '🔮', 'l': '⚔️', 'm': '🛡️', 'n': '🎯', 'o': '🔑',
    'p': '💎', 'q': '🎭', 'r': '🎪', 's': '🎨', 't': '🎵',
    'u': '🎬', 'v': '🎲', 'w': '🎸', 'x': '🎺', 'y': '🎻',
    'z': '🎹', ' ': '◆', '.': '●', ',': '○', '!': '▲',
    '?': '▼', '0': '◈', '1': '◉', '2': '◎', '3': '◐',
    '4': '◑', '5': '◒', '6': '◓', '7': '◔', '8': '◕',
    '9': '◖', '@': '◗', '#': '◘', '$': '◙', '%': '◚',
    '&': '◛', '*': '◜', '(': '◝', ')': '◞', '-': '◟',
    '+': '◠', '=': '◡', '[': '◢', ']': '◣', '{': '◤',
    '}': '◥', '|': '◦', '\\': '◧', '/': '◨', ':': '◩',
    ';': '◪', '"': '◫', "'": '◬', '<': '◭', '>': '◮',
    '\n': '◯'
  };

  // Create reverse mapping for decryption
  private static readonly reverseSymbolMap: { [key: string]: string } = 
    Object.fromEntries(Object.entries(this.symbolMap).map(([k, v]) => [v, k]));

  /**
   * Generates a pseudo-random sequence based on the key
   */
  private static generateKeySequence(key: string, length: number): number[] {
    const sequence: number[] = [];
    let seed = 0;
    
    // Create a seed from the key
    for (let i = 0; i < key.length; i++) {
      seed += key.charCodeAt(i) * (i + 1);
    }
    
    // Generate pseudo-random sequence
    for (let i = 0; i < length; i++) {
      seed = (seed * 9301 + 49297) % 233280;
      sequence.push(seed % length);
    }
    
    return sequence;
  }

  /**
   * Scrambles an array based on key sequence
   */
  private static scrambleArray<T>(arr: T[], keySequence: number[]): T[] {
    const scrambled = [...arr];
    
    for (let i = 0; i < keySequence.length && i < scrambled.length; i++) {
      const j = keySequence[i] % scrambled.length;
      [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
    }
    
    return scrambled;
  }

  /**
   * Unscrambles an array (reverse of scramble)
   */
  private static unscrambleArray<T>(arr: T[], keySequence: number[]): T[] {
    const unscrambled = [...arr];
    
    // Apply scrambling operations in reverse order
    for (let i = Math.min(keySequence.length, unscrambled.length) - 1; i >= 0; i--) {
      const j = keySequence[i] % unscrambled.length;
      [unscrambled[i], unscrambled[j]] = [unscrambled[j], unscrambled[i]];
    }
    
    return unscrambled;
  }

  /**
   * Encrypts a message using AyoCrypt algorithm
   */
  static encrypt(message: string, key: string): string {
    if (!key.trim()) {
      throw new Error('Key cannot be empty');
    }

    // Step 1: Convert to lowercase for consistent mapping
    const lowerMessage = message.toLowerCase();
    
    // Step 2: Replace characters with symbols
    const symbolized = lowerMessage
      .split('')
      .map(char => this.symbolMap[char] || char)
      .join('');

    // Step 3: Convert to array for scrambling
    const symbolArray = symbolized.split('');
    
    // Step 4: Generate key sequence and scramble
    const keySequence = this.generateKeySequence(key, symbolArray.length);
    const scrambled = this.scrambleArray(symbolArray, keySequence);
    
    // Step 5: Add key-based prefix/suffix for additional security
    const keyHash = this.generateKeyHash(key);
    
    return `${keyHash}${scrambled.join('')}${keyHash}`;
  }

  /**
   * Decrypts a message using AyoCrypt algorithm
   */
  static decrypt(encryptedMessage: string, key: string): string {
    if (!key.trim()) {
      throw new Error('Key cannot be empty');
    }

    try {
      // Step 1: Remove key-based prefix/suffix
      const keyHash = this.generateKeyHash(key);
      
      if (!encryptedMessage.startsWith(keyHash) || !encryptedMessage.endsWith(keyHash)) {
        throw new Error('Invalid key or corrupted message');
      }
      
      const coreMessage = encryptedMessage.slice(keyHash.length, -keyHash.length);
      
      // Step 2: Convert to array
      const symbolArray = coreMessage.split('');
      
      // Step 3: Generate key sequence and unscramble
      const keySequence = this.generateKeySequence(key, symbolArray.length);
      const unscrambled = this.unscrambleArray(symbolArray, keySequence);
      
      // Step 4: Convert symbols back to characters
      const decrypted = unscrambled
        .map(symbol => this.reverseSymbolMap[symbol] || symbol)
        .join('');
      
      return decrypted;
      
    } catch (error) {
      throw new Error('Decryption failed: Invalid key or corrupted message');
    }
  }

  /**
   * Generates a hash-like string from the key for verification
   */
  private static generateKeyHash(key: string): string {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = ((hash << 5) - hash + key.charCodeAt(i)) & 0xffffffff;
    }
    
    // Convert to symbols for consistency
    const hashStr = Math.abs(hash).toString();
    return hashStr.split('').map(digit => this.symbolMap[digit] || digit).join('').slice(0, 3);
  }
}

export default AyoCrypt;
